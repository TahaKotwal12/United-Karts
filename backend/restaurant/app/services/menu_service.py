from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from app.db import models
from app.schemas.restaurant import CategoryCreate, FoodItemCreate
import uuid

async def get_categories(db: AsyncSession):
    result = await db.execute(select(models.Category))
    return result.scalars().all()

async def get_food_items(db: AsyncSession, restaurant_id: uuid.UUID):
    result = await db.execute(
        select(models.FoodItem).where(models.FoodItem.restaurant_id == restaurant_id)
    )
    return result.scalars().all()

async def create_food_item(db: AsyncSession, food_item: FoodItemCreate):
    db_item = models.FoodItem(**food_item.dict())
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item

async def update_food_item(db: AsyncSession, item_id: uuid.UUID, data: dict):
    await db.execute(
        update(models.FoodItem)
        .where(models.FoodItem.core_mstr_united_kart_food_items_id == item_id)
        .values(**data)
    )
    await db.commit()

async def delete_food_item(db: AsyncSession, item_id: uuid.UUID):
    await db.execute(
        delete(models.FoodItem)
        .where(models.FoodItem.core_mstr_united_kart_food_items_id == item_id)
    )
    await db.commit() 