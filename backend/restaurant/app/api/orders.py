from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.restaurant import Order, OrderCreate
from app.services import order_service
import uuid
from typing import List
from app.core.security import get_current_user

router = APIRouter()

@router.get("/restaurant/{restaurant_id}", response_model=List[Order])
async def list_orders(restaurant_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    orders = await order_service.list_orders_by_restaurant(db, restaurant_id)
    # Format currency as INR and add GST if needed
    for o in orders:
        o.total_amount = float(o.total_amount)
        o.subtotal = float(o.subtotal)
        o.tax_amount = float(o.tax_amount)
    return orders

@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    order = await order_service.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.total_amount = float(order.total_amount)
    order.subtotal = float(order.subtotal)
    order.tax_amount = float(order.tax_amount)
    return order

@router.post("/", response_model=Order, status_code=status.HTTP_201_CREATED)
async def create_order(order: OrderCreate, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    db_order = await order_service.create_order(db, order)
    db_order.total_amount = float(db_order.total_amount)
    db_order.subtotal = float(db_order.subtotal)
    db_order.tax_amount = float(db_order.tax_amount)
    return db_order

@router.put("/{order_id}/status", response_model=None)
async def update_order_status(order_id: uuid.UUID, status: str, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await order_service.update_order_status(db, order_id, status)
    return {"success": True}

@router.put("/{order_id}/assign_delivery", response_model=None)
async def assign_delivery_partner(order_id: uuid.UUID, delivery_partner_id: uuid.UUID, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await order_service.assign_delivery_partner(db, order_id, delivery_partner_id)
    return {"success": True}

@router.put("/{order_id}/cancel", response_model=None)
async def cancel_order(order_id: uuid.UUID, reason: str, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await order_service.cancel_order(db, order_id, reason)
    return {"success": True}

# Implement order endpoints here 