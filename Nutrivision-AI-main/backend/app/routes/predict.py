"""
API routes for the prediction endpoint.
Main business logic for food recognition and recipe recommendation.
Bridged to Colab Microservice via ngrok.
"""

import base64
import requests
from fastapi import APIRouter, HTTPException
from app.schemas.schemas import PredictionRequestSchema, MLPredictionItemSchema
from app.services.calorie_service import CalorieService
from app.services.recipe_service import RecipeService
from app.config import ML_CONFIG
from typing import List

router = APIRouter(prefix="/api/v1", tags=["Prediction"])


@router.post("/predict", response_model=List[MLPredictionItemSchema])
async def predict_food(request: PredictionRequestSchema) -> List[MLPredictionItemSchema]:
    """
    Main prediction endpoint.
    Receives base64 image from React, forwards as multipart file to Sam's Colab tunnel,
    and returns the exact nutrition list directly from the ML microservice.
    """
    try:
        # Step 1: Predict the food
        if request.food_name:
            # Deterministic testing mode (skips ML)
            return [{
                "food": request.food_name.title(),
                "confidence": 1.0,
                "nutrition": {
                    "cal": 100.0,
                    "protein": 5.0,
                    "carbs": 10.0,
                    "fat": 1.0
                },
                "portion_g": 100.0
            }]
        else:
            # LIVE ML MICROSERVICE MODE
            ngrok_url = ML_CONFIG.get("ngrok_url")
            
            if not ngrok_url:
                raise HTTPException(
                    status_code=500, 
                    detail="ML_NGROK_URL is missing from the .env file. Ask Sam for the active link!"
                )
                
            if not request.image_base64:
                raise HTTPException(
                    status_code=400, 
                    detail="No image or food_name provided in the request."
                )

            # Clean the base64 string if React sent a data URI prefix
            b64_data = request.image_base64
            if "," in b64_data:
                b64_data = b64_data.split(",")[1]

            # Decode the base64 string into raw image bytes
            try:
                image_bytes = base64.b64decode(b64_data)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid base64 image data.")

            # Forward to Sam's Colab tunnel as a multipart/form-data file
            try:
                files = {"file": ("food_image.jpg", image_bytes, "image/jpeg")}
                headers = {"ngrok-skip-browser-warning": "true"}
                
                colab_response = requests.post(
                    f"{ngrok_url}/predict", 
                    files=files, 
                    headers=headers,
                    timeout=30  
                )
                colab_response.raise_for_status()
                
                raw_ml_data = colab_response.json()
                
                if isinstance(raw_ml_data, dict) and "error" in raw_ml_data:
                     raise HTTPException(status_code=400, detail=f"ML Error: {raw_ml_data['error']}")
                elif isinstance(raw_ml_data, list) and len(raw_ml_data) > 0 and isinstance(raw_ml_data[0], dict) and "error" in raw_ml_data[0]:
                     raise HTTPException(status_code=400, detail=f"ML Error: {raw_ml_data[0]['error']}")
                     
                if not isinstance(raw_ml_data, list):
                    # Wrap single object in list if necessary to conform to spec
                    raw_ml_data = [raw_ml_data]

                return raw_ml_data

            except HTTPException:
                raise
            except requests.exceptions.ConnectionError:
                raise HTTPException(
                    status_code=502, 
                    detail="Could not connect to the ML engine. Sam's ngrok tunnel might be offline or the URL changed."
                )
            except requests.exceptions.Timeout:
                raise HTTPException(
                    status_code=504, 
                    detail="The Colab ML engine took too long to respond. The T4 GPU might be overloaded."
                )
            except Exception as e:
                raise HTTPException(
                    status_code=502, 
                    detail=f"Error reading from Colab microservice: {str(e)}"
                )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction pipeline failed: {str(e)}"
        )


@router.get("/foods/{food_name}", response_model=dict)
async def get_food_info(food_name: str):
    """Get detailed information about a specific food."""
    try:
        food_info = CalorieService.get_food_by_name(food_name)
        if not food_info:
            raise HTTPException(status_code=404, detail=f"Food '{food_name}' not found")
        return food_info
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching food info: {str(e)}")


@router.get("/recipes/{food_name}", response_model=list)
async def get_food_recipes(food_name: str, appliances: str = None, health_tags: str = None):
    """Get recipes for a specific food with optional filtering."""
    try:
        available_appliances = appliances.split(",") if appliances else []
        health_constraints = health_tags.split(",") if health_tags else []
        
        recipes = RecipeService.get_filtered_recipes(
            food_name,
            available_appliances=available_appliances,
            health_constraints=health_constraints
        )
        return recipes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recipes: {str(e)}")


@router.get("/foods", response_model=list)
async def list_all_foods():
    """Get list of all available foods."""
    try:
        return CalorieService.get_all_foods()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching foods: {str(e)}")


@router.get("/recipes", response_model=list)
async def list_all_recipes():
    """Get list of all available recipes."""
    try:
        return RecipeService.get_all_recipes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recipes: {str(e)}")


@router.get("/low-calorie", response_model=list)
async def get_low_calorie_foods(max_calories: float = 50):
    """Get foods with calories below a threshold."""
    try:
        return CalorieService.get_low_calorie_foods(max_calories)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching low-calorie foods: {str(e)}")


@router.get("/low-sugar", response_model=list)
async def get_low_sugar_foods():
    """Get foods suitable for diabetic diets."""
    try:
        return CalorieService.get_low_sugar_foods()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching low-sugar foods: {str(e)}")
