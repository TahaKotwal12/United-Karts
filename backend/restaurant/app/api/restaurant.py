from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.restaurant import Review, ReviewCreate, Coupon, CouponCreate, Notification, NotificationCreate
from app.services import review_service, coupon_service, notification_service
import uuid
from typing import List
from app.core.security import get_current_user

router = APIRouter()

# Implement restaurant endpoints here 

@router.get("/reviews/restaurant/{restaurant_id}", response_model=List[Review])
async def list_reviews_by_restaurant(restaurant_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await review_service.list_reviews_by_restaurant(db, restaurant_id)

@router.get("/reviews/order/{order_id}", response_model=List[Review])
async def list_reviews_by_order(order_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await review_service.list_reviews_by_order(db, order_id)

@router.post("/reviews", response_model=Review, status_code=status.HTTP_201_CREATED)
async def create_review(review: ReviewCreate, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return await review_service.create_review(db, review)

@router.put("/reviews/{review_id}/respond", response_model=None)
async def respond_to_review(review_id: uuid.UUID, response: str, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await review_service.respond_to_review(db, review_id, response)
    return {"success": True}

@router.get("/coupons", response_model=List[Coupon])
async def list_coupons(active_only: bool = True, db: AsyncSession = Depends(get_db)):
    return await coupon_service.list_coupons(db, active_only)

@router.post("/coupons", response_model=Coupon, status_code=status.HTTP_201_CREATED)
async def create_coupon(coupon: CouponCreate, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return await coupon_service.create_coupon(db, coupon)

@router.put("/coupons/{coupon_id}/deactivate", response_model=None)
async def deactivate_coupon(coupon_id: uuid.UUID, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    await coupon_service.deactivate_coupon(db, coupon_id)
    return {"success": True}

@router.post("/coupons/apply", response_model=None)
async def apply_coupon(code: str, order_total: float, db: AsyncSession = Depends(get_db)):
    result = await coupon_service.apply_coupon(db, code, order_total)
    if not result:
        return {"valid": False, "discount": 0}
    return {"valid": True, "discount": result['discount'], "coupon": result['coupon']}

@router.get("/notifications/user/{user_id}", response_model=List[Notification])
async def list_notifications_by_user(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await notification_service.list_notifications_by_user(db, user_id)

@router.put("/notifications/{notification_id}/read", response_model=None)
async def mark_notification_read(notification_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    await notification_service.mark_notification_read(db, notification_id)
    return {"success": True}

@router.post("/notifications", response_model=Notification, status_code=status.HTTP_201_CREATED)
async def create_notification(notification: NotificationCreate, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return await notification_service.create_notification(db, notification) 