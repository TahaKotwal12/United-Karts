from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from app.db import models
from app.schemas.restaurant import NotificationCreate
import uuid

async def list_notifications_by_user(db: AsyncSession, user_id: uuid.UUID):
    result = await db.execute(
        select(models.Notification).where(models.Notification.user_id == user_id)
    )
    return result.scalars().all()

async def mark_notification_read(db: AsyncSession, notification_id: uuid.UUID):
    await db.execute(
        update(models.Notification)
        .where(models.Notification.core_mstr_united_kart_notifications_id == notification_id)
        .values(is_read=True)
    )
    await db.commit()

async def create_notification(db: AsyncSession, notification: NotificationCreate):
    db_notification = models.Notification(**notification.dict())
    db.add(db_notification)
    await db.commit()
    await db.refresh(db_notification)
    return db_notification 