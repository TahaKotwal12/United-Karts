from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.restaurant import Restaurant
from app.services import profile_service
import uuid
from app.core.security import get_current_user

router = APIRouter()

@router.get("/{restaurant_id}", response_model=Restaurant)
async def get_profile(restaurant_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    profile = await profile_service.get_profile(db, restaurant_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return profile

@router.put("/{restaurant_id}", response_model=None)
async def update_profile(restaurant_id: uuid.UUID, data: dict, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    try:
        await profile_service.update_profile(db, restaurant_id, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"success": True}

@router.put("/{restaurant_id}/open", response_model=None)
async def set_open_status(restaurant_id: uuid.UUID, is_open: bool, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await profile_service.set_open_status(db, restaurant_id, is_open)
    return {"success": True}

@router.put("/{restaurant_id}/business_hours", response_model=None)
async def set_business_hours(restaurant_id: uuid.UUID, opening_time: str, closing_time: str, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await profile_service.set_business_hours(db, restaurant_id, opening_time, closing_time)
    return {"success": True}

@router.put("/{restaurant_id}/payment_methods", response_model=None)
async def update_payment_methods(restaurant_id: uuid.UUID, payment_methods: str, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await profile_service.update_payment_methods(db, restaurant_id, payment_methods)
    return {"success": True}

# Implement profile endpoints here 