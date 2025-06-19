# backend/main.py
from fastapi import FastAPI
from fastapi.routing import APIRouter

# Import routers (even if they are empty for now)
from .restaurants import routes as restaurants_routes
from .users import routes as users_routes
from .delivery_partners import routes as delivery_partners_routes

app = FastAPI()

# Include routers
app.include_router(restaurants_routes.router, prefix="/restaurants", tags=["restaurants"])
app.include_router(users_routes.router, prefix="/users", tags=["users"])
app.include_router(delivery_partners_routes.router, prefix="/delivery-partners", tags=["delivery-partners"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the UnitedKarts Backend API!"}