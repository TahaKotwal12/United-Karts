from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from app.db import models
from app.schemas.restaurant import ReviewCreate
import uuid

async def list_reviews_by_restaurant(db: AsyncSession, restaurant_id: uuid.UUID):
    result = await db.execute(
        select(models.Review).where(models.Review.restaurant_id == restaurant_id)
    )
    return result.scalars().all()

async def list_reviews_by_order(db: AsyncSession, order_id: uuid.UUID):
    result = await db.execute(
        select(models.Review).where(models.Review.order_id == order_id)
    )
    return result.scalars().all()

async def create_review(db: AsyncSession, review: ReviewCreate):
    db_review = models.Review(**review.dict())
    db.add(db_review)
    await db.commit()
    await db.refresh(db_review)
    return db_review

async def respond_to_review(db: AsyncSession, review_id: uuid.UUID, response: str):
    await db.execute(
        update(models.Review)
        .where(models.Review.core_mstr_united_kart_reviews_id == review_id)
        .values(review_text=response)
    )
    await db.commit() 