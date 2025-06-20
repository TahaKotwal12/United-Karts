from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from app.db import models
from app.schemas.restaurant import CouponCreate
import uuid
from datetime import datetime

async def list_coupons(db: AsyncSession, active_only: bool = True):
    q = select(models.Coupon)
    if active_only:
        q = q.where(models.Coupon.is_active == True)
    result = await db.execute(q)
    return result.scalars().all()

async def create_coupon(db: AsyncSession, coupon: CouponCreate):
    db_coupon = models.Coupon(**coupon.dict())
    db.add(db_coupon)
    await db.commit()
    await db.refresh(db_coupon)
    return db_coupon

async def deactivate_coupon(db: AsyncSession, coupon_id: uuid.UUID):
    await db.execute(
        update(models.Coupon)
        .where(models.Coupon.core_mstr_united_kart_coupons_id == coupon_id)
        .values(is_active=False)
    )
    await db.commit()

async def apply_coupon(db: AsyncSession, code: str, order_total: float):
    result = await db.execute(
        select(models.Coupon).where(models.Coupon.code == code, models.Coupon.is_active == True, models.Coupon.valid_from <= datetime.now(), models.Coupon.valid_until >= datetime.now())
    )
    coupon = result.scalar_one_or_none()
    if not coupon:
        return None
    if order_total < float(coupon.min_order_amount):
        return None
    discount = 0
    if coupon.coupon_type == 'percentage':
        discount = order_total * float(coupon.discount_value) / 100
        if coupon.max_discount_amount:
            discount = min(discount, float(coupon.max_discount_amount))
    elif coupon.coupon_type == 'fixed_amount':
        discount = float(coupon.discount_value)
        if coupon.max_discount_amount:
            discount = min(discount, float(coupon.max_discount_amount))
    elif coupon.coupon_type == 'free_delivery':
        discount = 0  # handled at order level
    return {'discount': discount, 'coupon': coupon} 