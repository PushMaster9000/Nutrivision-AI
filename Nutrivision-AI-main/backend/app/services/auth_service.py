"""
Authentication service for user management.
Handles password hashing, user creation, and credential verification.
Uses bcrypt for secure password hashing.
"""
import re
import random
import string
from passlib.context import CryptContext
from typing import Optional, Dict, Any
from app.database import get_db
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from app.services.email_service import EmailService

# Bcrypt password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service for authentication operations"""

    # ================= PASSWORD UTILS ================= #

    @staticmethod
    def hash_password(password) -> str:
        # 1. Force the input to a clean string
        if hasattr(password, "get_secret_value"):
            password = password.get_secret_value()
        
        pw_str = str(password).strip()

        # 2. Bcrypt limit is 72 bytes. We truncate to be safe.
        # If the input was an object by mistake, this keeps it from crashing.
        safe_password = pw_str[:72]

        if len(safe_password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters"
            )

        return pwd_context.hash(safe_password)


    @staticmethod
    def verify_password(plain_password, hashed_password: str) -> bool:
        """
        Verify a plain text password against its hash.
        """

        if hasattr(plain_password, "get_secret_value"):
            plain_password = plain_password.get_secret_value()

        if isinstance(plain_password, bytes):
            plain_password = plain_password.decode("utf-8", errors="ignore")

        plain_password = str(plain_password)[:72]

        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            return False

    # ================= USER CRUD ================= #

    @staticmethod
    def create_user(username: str, email: str, password) -> Dict[str, Any]:
        db = get_db()
        users_collection = db["users"]

        # Ensure username isn't None if the frontend sent 'name' instead of 'username'
        if not username:
             raise HTTPException(status_code=400, detail="Username is required")

        username = str(username).strip().lower()
        email = str(email).strip().lower()

        # Check duplicates
        existing_user = users_collection.find_one({
            "$or": [{"email": email}, {"username": username}]
        })

        if existing_user:
            if existing_user.get("email") == email:
                raise HTTPException(status_code=409, detail="Email already registered")
            raise HTTPException(status_code=409, detail="Username already taken")

        # Hash password
        hashed_pw = AuthService.hash_password(password)

        verification_code = ''.join(random.choices(string.digits, k=6))

        user_doc = {
            "username": username,
            "email": email,
            "hashed_password": hashed_pw,
            "role": "user",
            "is_verified": False,
            "verification_code": verification_code,
            "created_at": datetime.utcnow()
        }
        
        # ... rest of your insert logic ...

    @staticmethod
    def authenticate_user(email: str, password) -> Optional[Dict[str, Any]]:
        db = get_db()
        users_collection = db["users"]

        email = email.strip().lower()
        user = users_collection.find_one({"email": email})

        if not user:
            print(f"✗ Login attempt: User not found - {email}")
            return None

        # FIX: Check both "hashed_password" and "password" so it works 
        # no matter which version of the signup route created the account!
        stored_password = user.get("hashed_password") or user.get("password", "")

        if not AuthService.verify_password(password, stored_password):
            print(f"✗ Login attempt: Invalid password for {email}")
            return None

        # Check if user is verified
        if not user.get("is_verified", True):
            print(f"✗ Login attempt: Unverified account for {email}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Please verify your email to log in"
            )

        print(f"✓ User logged in successfully: {email}")
        return AuthService._format_user_response(user)

    @staticmethod
    def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        db = get_db()
        users_collection = db["users"]

        email = email.strip().lower()
        user = users_collection.find_one({"email": email})

        return AuthService._format_user_response(user) if user else None

    @staticmethod
    def verify_user_email(email: str, code: str) -> Optional[Dict[str, Any]]:
        db = get_db()
        users_collection = db["users"]
        email = email.strip().lower()

        user = users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if user.get("is_verified"):
            return AuthService._format_user_response(user)
            
        if user.get("verification_code") != code:
            raise HTTPException(status_code=400, detail="Invalid verification code")
            
        # Mark as verified
        users_collection.update_one(
            {"email": email},
            {"$set": {"is_verified": True}, "$unset": {"verification_code": ""}}
        )
        # Update local dict so the formatter returns correct logic if we need it
        user["is_verified"] = True
        return AuthService._format_user_response(user)

    @staticmethod
    def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
        db = get_db()
        users_collection = db["users"]

        username = username.strip().lower()
        user = users_collection.find_one({"username": username})

        return AuthService._format_user_response(user) if user else None

    # ================= OUTPUT CLEANER ================= #

    @staticmethod
    def _format_user_response(user: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "username": user.get("username"),
            "email": user.get("email"),
            "role": user.get("role", "user"),
            "created_at": user.get("created_at")
        }
    
    # ================= PROFILE & SECURITY ================= #

    @staticmethod
    def update_user_profile(email: str, name: str, bio: str) -> bool:
        db = get_db()
        users_collection = db["users"]
        
        name = name.strip().lower()
        email_clean = email.strip().lower()
        
        # Check if the requested username is already taken by someone else
        existing_user = users_collection.find_one({"username": name})
        if existing_user and existing_user.get("email") != email_clean:
            raise HTTPException(status_code=409, detail="Username already taken")
        
        # Update the username and bio
        result = users_collection.update_one(
            {"email": email_clean},
            {"$set": {"username": name, "bio": bio}}
        )
        return result.acknowledged

    @staticmethod
    def update_password(email: str, old_password: str, new_password: str) -> bool:
        db = get_db()
        users_collection = db["users"]
        email = email.strip().lower()

        # Find user
        user = users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Verify old password
        stored_password = user.get("hashed_password") or user.get("password", "")
        if not AuthService.verify_password(old_password, stored_password):
            raise HTTPException(status_code=400, detail="Incorrect current password")

        # Hash new password and save it 
        # (Saving to both fields to prevent login bugs with old accounts)
        new_hashed = AuthService.hash_password(new_password)
        users_collection.update_one(
            {"email": email},
            {"$set": {
                "hashed_password": new_hashed, 
                "password": new_hashed 
            }}
        )
        return True

    @staticmethod
    def delete_account(email: str) -> bool:
        db = get_db()
        email = email.strip().lower()

        # Delete user
        db["users"].delete_one({"email": email})
        
        # Wipe all their associated data to keep the database clean
        db["saved_recipes"].delete_many({"user_email": email})
        db["scan_history"].delete_many({"user_email": email})
        
        return True
    # ================= FULL RECIPE SAVE TO MONGODB ================= #

    @staticmethod
    def toggle_save_recipe(email: str, recipe_data: dict) -> dict:
        db = get_db()
        saved_collection = db["saved_recipes"]
        logs_collection = db["calorie_logs"]
        
        recipe_title = recipe_data.get("name") or recipe_data.get("title")
        
        # Using local time formatting to ensure correct timezone logic
        today_str = recipe_data.get("date")
        if not today_str:
            today_str = datetime.now().strftime("%Y-%m-%d")

        # 1. UPSERT INTO COOKBOOK (Prevents multiple copies of the same recipe)
        existing_save = saved_collection.find_one({"user_email": email, "title": recipe_title})
        
        if not existing_save:
            # Only insert if it doesn't already exist
            recipe_data["user_email"] = email
            recipe_data["title"] = recipe_title
            saved_collection.insert_one(recipe_data)

        # 2. ALWAYS LOG CALORIES FOR TODAY
        cal_str = str(recipe_data.get("calories", "0"))
        digits = re.findall(r'\d+', cal_str)
        cal_value = int(digits[0]) if digits else 0

        if cal_value > 0:
            logs_collection.update_one(
                {"user_email": email, "date": today_str},
                {"$inc": {"total_calories": cal_value}},
                upsert=True
            )
            
        return {"status": "saved", "title": recipe_title}
        
    @staticmethod
    def get_saved_recipe_titles(email: str) -> list:
        db = get_db()
        saved_collection = db["saved_recipes"]
        
        # Find all rows belonging to this user
        user_saved_docs = saved_collection.find({"user_email": email}, {"title": 1})
        
        # We will track saved recipes by TITLE instead of ID now
        return [doc["title"] for doc in user_saved_docs if "title" in doc]