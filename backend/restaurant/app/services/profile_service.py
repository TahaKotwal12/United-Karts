from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from app.db import models
import uuid
from typing import Optional

# Simple phone and postal code validation for India
import re
def is_valid_indian_phone(phone: str) -> bool:
    return bool(re.match(r"^[6-9]\d{9}$", phone))

def is_valid_postal_code(code: str) -> bool:
    return bool(re.match(r"^\d{6}$", code))

async def get_profile(db: AsyncSession, restaurant_id: uuid.UUID):
    result = await db.execute(
        select(models.Restaurant).where(models.Restaurant.core_mstr_united_kart_restaurants_id == restaurant_id)
    )
    return result.scalar_one_or_none()

async def update_profile(db: AsyncSession, restaurant_id: uuid.UUID, data: dict):
    # Validate phone and postal code if present
    if 'phone' in data and not is_valid_indian_phone(data['phone']):
        raise ValueError("Invalid Indian phone number")
    if 'postal_code' in data and not is_valid_postal_code(data['postal_code']):
        raise ValueError("Invalid Indian postal code")
    await db.execute(
        update(models.Restaurant)
        .where(models.Restaurant.core_mstr_united_kart_restaurants_id == restaurant_id)
        .values(**data)
    )
    await db.commit()

async def set_open_status(db: AsyncSession, restaurant_id: uuid.UUID, is_open: bool):
    await db.execute(
        update(models.Restaurant)
        .where(models.Restaurant.core_mstr_united_kart_restaurants_id == restaurant_id)
        .values(is_open=is_open)
    )
    await db.commit()

async def set_business_hours(db: AsyncSession, restaurant_id: uuid.UUID, opening_time: str, closing_time: str):
    await db.execute(
        update(models.Restaurant)
        .where(models.Restaurant.core_mstr_united_kart_restaurants_id == restaurant_id)
        .values(opening_time=opening_time, closing_time=closing_time)
    )
    await db.commit()

# Payment methods can be stored as a JSON/text field or in a separate table. Here, we assume a JSON/text field for simplicity.
async def update_payment_methods(db: AsyncSession, restaurant_id: uuid.UUID, payment_methods: str):
    await db.execute(
        update(models.Restaurant)
        .where(models.Restaurant.core_mstr_united_kart_restaurants_id == restaurant_id)
        .values(payment_methods=payment_methods)
    )
    await db.commit() 