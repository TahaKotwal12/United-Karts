from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.restaurant import Category, FoodItem, FoodItemCreate
from app.services import menu_service
import uuid
from typing import List
from app.core.security import get_current_user

router = APIRouter()

@router.get("/categories", response_model=List[Category])
async def list_categories(db: AsyncSession = Depends(get_db)):
    return await menu_service.get_categories(db)

@router.get("/items/{restaurant_id}", response_model=List[FoodItem])
async def list_food_items(restaurant_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await menu_service.get_food_items(db, restaurant_id)

@router.post("/items", response_model=FoodItem, status_code=status.HTTP_201_CREATED)
async def create_food_item(item: FoodItemCreate, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return await menu_service.create_food_item(db, item)

@router.put("/items/{item_id}", response_model=None)
async def update_food_item(item_id: uuid.UUID, data: dict, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await menu_service.update_food_item(db, item_id, data)
    return {"success": True}

@router.delete("/items/{item_id}", response_model=None)
async def delete_food_item(item_id: uuid.UUID, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await menu_service.delete_food_item(db, item_id)
    return {"success": True} 