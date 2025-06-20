from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from app.db import models
import uuid
from datetime import datetime, timedelta

async def get_analytics(db: AsyncSession, restaurant_id: uuid.UUID, period: str = 'today'):
    now = datetime.now()
    if period == 'today':
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == 'week':
        start = now - timedelta(days=now.weekday())
        start = start.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == 'month':
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    elif period == 'year':
        start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    else:
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    # Revenue, orders, avg order value, customers, rating, total ratings
    q = select(
        func.sum(models.Order.total_amount),
        func.count(models.Order.core_mstr_united_kart_orders_id),
        func.avg(models.Order.total_amount),
        func.count(func.distinct(models.Order.customer_id)),
        func.avg(models.Order.rating),
        func.count(models.Order.rating)
    ).where(
        models.Order.restaurant_id == restaurant_id,
        models.Order.created_at >= start
    )
    result = await db.execute(q)
    revenue, orders, avg_order_value, customers, rating, total_ratings = result.fetchone()

    # Top items
    top_items_q = select(
        models.OrderItem.food_item_id,
        func.sum(models.OrderItem.quantity).label('orders'),
        func.sum(models.OrderItem.total_price).label('revenue')
    ).join(models.Order, models.OrderItem.order_id == models.Order.core_mstr_united_kart_orders_id)
    top_items_q = top_items_q.where(
        models.Order.restaurant_id == restaurant_id,
        models.Order.created_at >= start
    ).group_by(models.OrderItem.food_item_id).order_by(func.sum(models.OrderItem.quantity).desc()).limit(5)
    top_items_result = await db.execute(top_items_q)
    top_items = [
        {
            'food_item_id': row[0],
            'orders': row[1],
            'revenue': float(row[2])
        } for row in top_items_result.fetchall()
    ]

    return {
        'period': period,
        'revenue': float(revenue or 0),
        'orders': orders or 0,
        'avg_order_value': float(avg_order_value or 0),
        'customers': customers or 0,
        'rating': float(rating or 0),
        'total_ratings': total_ratings or 0,
        'top_items': top_items
    } 