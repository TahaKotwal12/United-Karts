from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router as api_router
from .core.config import settings

app = FastAPI(
    title="United Karts Restaurant Service",
    description="Restaurant microservice for United Karts food delivery platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "United Karts Restaurant Service",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "restaurant"} 