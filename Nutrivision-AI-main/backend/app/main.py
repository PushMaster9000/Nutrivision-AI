"""
Main FastAPI application.
Entry point for the Smart Food Recognition and Recipe Recommendation System.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import connect_db, close_db, initialize_collections, initialize_users_collection
from app.routes import predict, recipes, auth
from app.schemas.schemas import HealthCheckSchema
from app.routes import auth, recipes, community
from app.routes import calories 


# Application lifecycle management
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application startup and shutdown events.
    """
    # Startup
    try:
        connect_db()
        initialize_collections()
        initialize_users_collection()
        print("✓ Application started successfully")
    except Exception as e:
        print(f"✗ Failed to start application: {e}")
        raise
    
    yield
    
    # Shutdown
    try:
        close_db()
        print("✓ Application shut down successfully")
    except Exception as e:
        print(f"✗ Error during shutdown: {e}")


# Create FastAPI app
app = FastAPI(
    title="Smart Food Recognition API",
    description="Food image recognition and personalized recipe recommendation system",
    version="1.0.0",
    lifespan=lifespan
)


# Add CORS middleware for React frontend integration
# TODO: In production, restrict to specific frontend domain(s)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routes
app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(recipes.router)
app.include_router(community.router)
app.include_router(calories.router)

# Health check endpoint
@app.get("/health", response_model=HealthCheckSchema)
async def health_check() -> HealthCheckSchema:
    """
    Health check endpoint to verify API and database status.
    
    Returns:
        HealthCheckSchema with status information
    """
    try:
        from app.database import get_db
        db = get_db()
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return HealthCheckSchema(
        status="healthy",
        database=db_status,
        version="1.0.0"
    )


# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "message": "Smart Food Recognition and Recipe Recommendation API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    # Run with: python -m uvicorn app.main:app --reload
    uvicorn.run(app, host="0.0.0.0", port=8000)
