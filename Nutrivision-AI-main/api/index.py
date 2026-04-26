import sys
import os

# Add the backend directory to the path so 'app' can be imported
# The structure on Vercel will be:
# / (root)
#   api/index.py
#   backend/
#     app/
#       main.py

# Adding the absolute path to backend to sys.path
backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.append(backend_path)

# Import the FastAPI app instance from backend/app/main.py
try:
    from app.main import app
except ImportError as e:
    print(f"Error importing app: {e}")
    print(f"sys.path: {sys.path}")
    raise e

# The Vercel Python runtime expects the variable 'app' or 'handler'
handler = app
