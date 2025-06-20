import uuid
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, time

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image: Optional[str] = None
    is_active: Optional[bool] = True
    sort_order: Optional[int] = 0

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    core_mstr_united_kart_categories_id: uuid.UUID
    created_at: datetime

    class Config:
        orm_mode = True

class RestaurantBase(BaseModel):
    name: str
    description: Optional[str] = None
    phone: str
    email: Optional[str] = None
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    latitude: float
    longitude: float
    image: Optional[str] = None
    cover_image: Optional[str] = None
    cuisine_type: Optional[str] = None
    avg_delivery_time: Optional[int] = None
    min_order_amount: Optional[float] = 0
    delivery_fee: Optional[float] = 0
    is_open: Optional[bool] = True
    opening_time: Optional[time] = None
    closing_time: Optional[time] = None

class RestaurantCreate(RestaurantBase):
    pass

class Restaurant(RestaurantBase):
    core_mstr_united_kart_restaurants_id: uuid.UUID
    rating: float
    total_ratings: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class FoodItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    image: Optional[str] = None
    is_veg: Optional[bool] = True
    ingredients: Optional[str] = None
    allergens: Optional[str] = None
    calories: Optional[int] = None
    prep_time: Optional[int] = None
    status: Optional[str] = "available"
    sort_order: Optional[int] = 0
    category_id: uuid.UUID

class FoodItemCreate(FoodItemBase):
    restaurant_id: uuid.UUID

class FoodItem(FoodItemBase):
    core_mstr_united_kart_food_items_id: uuid.UUID
    restaurant_id: uuid.UUID
    rating: float
    total_ratings: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class FoodVariantBase(BaseModel):
    name: str
    price_adjustment: Optional[float] = 0
    is_default: Optional[bool] = False
    food_item_id: uuid.UUID

class FoodVariantCreate(FoodVariantBase):
    pass

class FoodVariant(FoodVariantBase):
    core_mstr_united_kart_food_variants_id: uuid.UUID
    created_at: datetime
    class Config:
        orm_mode = True

class OrderItemBase(BaseModel):
    food_item_id: uuid.UUID
    variant_id: Optional[uuid.UUID]
    quantity: int
    unit_price: float
    total_price: float
    special_instructions: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    order_id: uuid.UUID

class OrderItem(OrderItemBase):
    core_mstr_united_kart_order_items_id: uuid.UUID
    order_id: uuid.UUID
    created_at: datetime
    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    customer_id: uuid.UUID
    restaurant_id: uuid.UUID
    delivery_partner_id: Optional[uuid.UUID]
    delivery_address_id: Optional[uuid.UUID]
    order_number: str
    subtotal: float
    tax_amount: float
    delivery_fee: float
    discount_amount: float
    total_amount: float
    payment_method: str
    payment_status: str
    payment_id: Optional[str]
    order_status: str
    estimated_delivery_time: Optional[datetime]
    actual_delivery_time: Optional[datetime]
    special_instructions: Optional[str]
    cancellation_reason: Optional[str]
    rating: Optional[int]
    review: Optional[str]

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    core_mstr_united_kart_orders_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class ReviewBase(BaseModel):
    order_id: uuid.UUID
    customer_id: uuid.UUID
    restaurant_id: uuid.UUID
    delivery_partner_id: Optional[uuid.UUID]
    rating: int
    review_text: Optional[str]
    review_type: str

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    core_mstr_united_kart_reviews_id: uuid.UUID
    created_at: datetime
    class Config:
        orm_mode = True

class CouponBase(BaseModel):
    code: str
    title: str
    description: Optional[str]
    coupon_type: str
    discount_value: float
    min_order_amount: float
    max_discount_amount: Optional[float]
    usage_limit: Optional[int]
    valid_from: datetime
    valid_until: datetime
    is_active: Optional[bool] = True

class CouponCreate(CouponBase):
    pass

class Coupon(CouponBase):
    core_mstr_united_kart_coupons_id: uuid.UUID
    used_count: int
    created_at: datetime
    class Config:
        orm_mode = True

class NotificationBase(BaseModel):
    user_id: uuid.UUID
    title: str
    message: str
    notification_type: str
    is_read: Optional[bool] = False
    data_json: Optional[str]

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    core_mstr_united_kart_notifications_id: uuid.UUID
    created_at: datetime
    class Config:
        orm_mode = True 