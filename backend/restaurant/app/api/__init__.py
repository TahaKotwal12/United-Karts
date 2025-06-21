from fastapi import APIRouter, Depends
from fastapi import status
from pydantic import BaseModel
from datetime import timedelta

from . import restaurant, menu, orders, analytics, profile, payment, upload
from app.core.security import create_access_token

router = APIRouter()

router.include_router(restaurant.router, prefix="/restaurant", tags=["restaurant"])
router.include_router(menu.router, prefix="/menu", tags=["menu"])
router.include_router(orders.router, prefix="/orders", tags=["orders"])
router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
router.include_router(profile.router, prefix="/profile", tags=["profile"])
router.include_router(payment.router, prefix="/payment", tags=["payment"])
router.include_router(upload.router, prefix="/upload", tags=["upload"])

class LoginRequest(BaseModel):
    user_id: str
    role: str
    password: str

@router.post("/auth/login")
async def login(data: LoginRequest):
    # Dummy login for testing: always returns a token
    access_token = create_access_token({"user_id": data.user_id, "role": data.role}, expires_delta=timedelta(hours=1))
    return {"access_token": access_token, "token_type": "bearer"} 