import razorpay
from app.core.config import settings
import uuid
from typing import Dict, Any

class RazorpayService:
    def __init__(self):
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
    
    def create_order(self, amount: int, currency: str = "INR", receipt: str = None) -> Dict[str, Any]:
        """Create a Razorpay order"""
        if not receipt:
            receipt = f"order_{uuid.uuid4().hex[:8]}"
        
        order_data = {
            "amount": amount,  # Amount in paise
            "currency": currency,
            "receipt": receipt,
            "payment_capture": 1  # Auto capture payment
        }
        
        try:
            order = self.client.order.create(data=order_data)
            return {
                "success": True,
                "order_id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
                "receipt": order["receipt"]
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def verify_payment(self, payment_id: str, order_id: str, signature: str) -> Dict[str, Any]:
        """Verify payment signature"""
        try:
            self.client.utility.verify_payment_signature({
                "razorpay_payment_id": payment_id,
                "razorpay_order_id": order_id,
                "razorpay_signature": signature
            })
            return {"success": True, "verified": True}
        except Exception as e:
            return {"success": False, "verified": False, "error": str(e)}
    
    def process_refund(self, payment_id: str, amount: int = None) -> Dict[str, Any]:
        """Process refund"""
        refund_data = {"payment_id": payment_id}
        if amount:
            refund_data["amount"] = amount
        
        try:
            refund = self.client.payment.refund(data=refund_data)
            return {
                "success": True,
                "refund_id": refund["id"],
                "amount": refund["amount"],
                "status": refund["status"]
            }
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_payment_details(self, payment_id: str) -> Dict[str, Any]:
        """Get payment details"""
        try:
            payment = self.client.payment.fetch(payment_id)
            return {
                "success": True,
                "payment_id": payment["id"],
                "amount": payment["amount"],
                "currency": payment["currency"],
                "status": payment["status"],
                "method": payment["method"],
                "created_at": payment["created_at"]
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

razorpay_service = RazorpayService() 