from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from app.db import models
from app.schemas.restaurant import OrderCreate
import uuid

async def list_orders_by_restaurant(db: AsyncSession, restaurant_id: uuid.UUID):
    result = await db.execute(
        select(models.Order).where(models.Order.restaurant_id == restaurant_id)
    )
    return result.scalars().all()

async def get_order(db: AsyncSession, order_id: uuid.UUID):
    result = await db.execute(
        select(models.Order).where(models.Order.core_mstr_united_kart_orders_id == order_id)
    )
    return result.scalar_one_or_none()

async def create_order(db: AsyncSession, order: OrderCreate):
    db_order = models.Order(**order.dict())
    db.add(db_order)
    await db.commit()
    await db.refresh(db_order)
    return db_order

async def update_order_status(db: AsyncSession, order_id: uuid.UUID, status: str):
    await db.execute(
        update(models.Order)
        .where(models.Order.core_mstr_united_kart_orders_id == order_id)
        .values(order_status=status)
    )
    await db.commit()

async def assign_delivery_partner(db: AsyncSession, order_id: uuid.UUID, delivery_partner_id: uuid.UUID):
    await db.execute(
        update(models.Order)
        .where(models.Order.core_mstr_united_kart_orders_id == order_id)
        .values(delivery_partner_id=delivery_partner_id)
    )
    await db.commit()

async def cancel_order(db: AsyncSession, order_id: uuid.UUID, reason: str):
    await db.execute(
        update(models.Order)
        .where(models.Order.core_mstr_united_kart_orders_id == order_id)
        .values(order_status='cancelled', cancellation_reason=reason)
    )
    await db.commit() 