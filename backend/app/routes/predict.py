"""
API routes for the prediction endpoint.
Main business logic for food recognition and recipe recommendation.

Frontend Connection Points:
1. POST /api/v1/predict
   - Send image_base64 (optional), health constraints, available appliances
   - Returns: detected food, confidence, nutritional info, matching recipes

2. GET /api/v1/foods
   - Get all available foods for dropdown/search UI
   - Returns: list of all foods with nutritional info

3. GET /api/v1/foods/{food_name}
   - Get detailed info about specific food
   - Returns: food details including calories and health tags

4. GET /api/v1/recipes
   - Get all available recipes for exploration
   - Returns: list of all recipes

5. GET /api/v1/recipes/{food_name}
   - Get recipes for specific food with optional filtering
   - Query params: appliances (comma-separated), health_tags (comma-separated)
   - Returns: filtered recipes matching appliances and health constraints

6. GET /api/v1/low-calorie?max_calories=50
   - Get low-calorie foods for diet tracking
   - Returns: foods with calories <= threshold

7. GET /api/v1/low-sugar
   - Get low-sugar foods for diabetic-friendly recipes
   - Returns: foods marked as low-sugar
"""

from fastapi import APIRouter, HTTPException
from app.schemas.schemas import PredictionRequestSchema, PredictionResponseSchema
from app.models.fruit_model import get_model
from app.services.calorie_service import CalorieService
from app.services.recipe_service import RecipeService

router = APIRouter(prefix="/api/v1", tags=["Prediction"])


@router.post("/predict", response_model=PredictionResponseSchema)
async def predict_food(request: PredictionRequestSchema) -> PredictionResponseSchema:
    """
    Main prediction endpoint.
    Accepts food image (optional), recognizes the food, fetches nutritional info,
    and recommends recipes based on appliances and health constraints.
    
    TODO: Consider protecting with authentication in production:
    - Add Depends(get_current_user) to require JWT auth
    - Track prediction history per user
    - Rate limit predictions per user
    
    Request Body:
        - image_base64: Base64 encoded image (optional for testing)
        - food_name: Optional food name for deterministic testing (skips ML if provided)
        - health_constraints: List of health tags to filter recipes
        - available_appliances: List of available kitchen appliances
    
    Response:
        - detected_food: Name of recognized food
        - confidence: Prediction confidence (0-1)
        - food_info: Nutritional information
        - matching_recipes: Filtered recipes
    
    Returns:
        PredictionResponseSchema with food and recipe recommendations
    
    Raises:
        HTTPException: If food not found or other errors occur
    
    NOTE: If food_name is provided, ML prediction is skipped (useful for testing).
    Otherwise, mock prediction is used. In production, replace with real ML model.
    """
    try:
        # Step 1: Predict the food (or use provided food_name for testing)
        if request.food_name:
            # Deterministic mode: skip ML, use provided food name
            predicted_food = request.food_name.lower()
            confidence = 1.0
        else:
            # ML mode: use mock prediction (or real ML in production)
            predicted_food, confidence = get_model().predict(request.image_base64)
        
        # Step 2: Fetch food information from database
        food_info = CalorieService.get_food_by_name(predicted_food)
        
        if not food_info:
            raise HTTPException(
                status_code=404,
                detail=f"Food '{predicted_food}' not found in database"
            )
        
        # Step 3: Fetch and filter recipes
        matching_recipes = RecipeService.get_filtered_recipes(
            predicted_food,
            available_appliances=request.available_appliances if request.available_appliances else None,
            health_constraints=request.health_constraints if request.health_constraints else None
        )
        
        # Step 4: Build and return response
        response = PredictionResponseSchema(
            detected_food=predicted_food,
            confidence=confidence,
            food_info=food_info,
            matching_recipes=matching_recipes
        )
        
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@router.get("/foods/{food_name}", response_model=dict)
async def get_food_info(food_name: str):
    """
    Get detailed information about a specific food.
    
    Args:
        food_name: Name of the food
    
    Returns:
        Food information including calories and health tags
    """
    try:
        food_info = CalorieService.get_food_by_name(food_name)
        
        if not food_info:
            raise HTTPException(
                status_code=404,
                detail=f"Food '{food_name}' not found"
            )
        
        return food_info
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching food info: {str(e)}"
        )


@router.get("/recipes/{food_name}", response_model=list)
async def get_food_recipes(
    food_name: str,
    appliances: str = None,
    health_tags: str = None
):
    """
    Get recipes for a specific food with optional filtering.
    
    Args:
        food_name: Name of the food
        appliances: Comma-separated list of available appliances
        health_tags: Comma-separated list of health constraints
    
    Returns:
        List of matching recipes
    """
    try:
        # Parse optional query parameters
        available_appliances = appliances.split(",") if appliances else []
        health_constraints = health_tags.split(",") if health_tags else []
        
        recipes = RecipeService.get_filtered_recipes(
            food_name,
            available_appliances=available_appliances,
            health_constraints=health_constraints
        )
        
        return recipes
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching recipes: {str(e)}"
        )


@router.get("/foods", response_model=list)
async def list_all_foods():
    """
    Get list of all available foods.
    Useful for frontend to display available foods that can be detected.
    
    Returns:
        List of all foods in the database
    """
    try:
        foods = CalorieService.get_all_foods()
        return foods
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching foods: {str(e)}"
        )


@router.get("/recipes", response_model=list)
async def list_all_recipes():
    """
    Get list of all available recipes.
    Useful for frontend to explore all recipes in the database.
    
    Returns:
        List of all recipes
    """
    try:
        recipes = RecipeService.get_all_recipes()
        return recipes
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching recipes: {str(e)}"
        )


@router.get("/low-calorie", response_model=list)
async def get_low_calorie_foods(max_calories: float = 50):
    """
    Get foods with calories below a threshold.
    
    Args:
        max_calories: Maximum calories per 100g (default: 50)
    
    Returns:
        List of low-calorie foods
    """
    try:
        foods = CalorieService.get_low_calorie_foods(max_calories)
        return foods
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching low-calorie foods: {str(e)}"
        )


@router.get("/low-sugar", response_model=list)
async def get_low_sugar_foods():
    """
    Get foods suitable for diabetic diets.
    
    Returns:
        List of low-sugar foods
    """
    try:
        foods = CalorieService.get_low_sugar_foods()
        return foods
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching low-sugar foods: {str(e)}"
        )
