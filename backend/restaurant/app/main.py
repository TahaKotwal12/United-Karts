from fastapi import FastAPI
from .api import router as api_router

app = FastAPI(title="United Karts Restaurant Service")

app.include_router(api_router, prefix="/api") 