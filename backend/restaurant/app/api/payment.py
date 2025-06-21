from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.razorpay_service import razorpay_service
from app.core.security import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class CreateOrderRequest(BaseModel):
    amount: int  # Amount in paise
    currency: str = "INR"
    receipt: Optional[str] = None

class VerifyPaymentRequest(BaseModel):
    payment_id: str
    order_id: str
    signature: str

class RefundRequest(BaseModel):
    payment_id: str
    amount: Optional[int] = None

@router.post("/create-order")
async def create_razorpay_order(
    request: CreateOrderRequest,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user)
):
    """Create a Razorpay order"""
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = razorpay_service.create_order(
        amount=request.amount,
        currency=request.currency,
        receipt=request.receipt
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.post("/verify-payment")
async def verify_payment(
    request: VerifyPaymentRequest,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user)
):
    """Verify payment signature"""
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = razorpay_service.verify_payment(
        payment_id=request.payment_id,
        order_id=request.order_id,
        signature=request.signature
    )
    
    if not result["success"] or not result["verified"]:
        raise HTTPException(status_code=400, detail="Payment verification failed")
    
    return result

@router.post("/refund")
async def process_refund(
    request: RefundRequest,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user)
):
    """Process refund"""
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = razorpay_service.process_refund(
        payment_id=request.payment_id,
        amount=request.amount
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.get("/payment/{payment_id}")
async def get_payment_details(
    payment_id: str,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user)
):
    """Get payment details"""
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = razorpay_service.get_payment_details(payment_id)
    
    if not result["success"]:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    return result 