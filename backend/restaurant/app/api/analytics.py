from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services import analytics_service
import uuid

router = APIRouter()

@router.get("/restaurant/{restaurant_id}")
async def get_analytics(
    restaurant_id: uuid.UUID,
    period: str = Query('today', enum=["today", "week", "month", "year"]),
    db: AsyncSession = Depends(get_db)
):
    return await analytics_service.get_analytics(db, restaurant_id, period)

# Implement analytics endpoints here 