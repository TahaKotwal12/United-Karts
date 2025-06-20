import uuid
from sqlalchemy import (
    Column, String, Text, Integer, Boolean, DECIMAL, ForeignKey, Enum, Time, DateTime
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base
import enum
from datetime import datetime

class RestaurantStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"

class FoodStatus(str, enum.Enum):
    available = "available"
    unavailable = "unavailable"
    out_of_stock = "out_of_stock"

class Category(Base):
    __tablename__ = "core_mstr_united_kart_categories"
    core_mstr_united_kart_categories_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    image = Column(String(500))
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Restaurant(Base):
    __tablename__ = "core_mstr_united_kart_restaurants"
    core_mstr_united_kart_restaurants_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    phone = Column(String(20), nullable=False)
    email = Column(String(255))
    address_line1 = Column(String(255), nullable=False)
    address_line2 = Column(String(255))
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=False)
    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)
    image = Column(String(500))
    cover_image = Column(String(500))
    cuisine_type = Column(String(100))
    avg_delivery_time = Column(Integer)
    min_order_amount = Column(DECIMAL(10, 2), default=0)
    delivery_fee = Column(DECIMAL(10, 2), default=0)
    rating = Column(DECIMAL(3, 2), default=0)
    total_ratings = Column(Integer, default=0)
    status = Column(Enum(RestaurantStatus), default=RestaurantStatus.active)
    is_open = Column(Boolean, default=True)
    opening_time = Column(Time)
    closing_time = Column(Time)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class FoodItem(Base):
    __tablename__ = "core_mstr_united_kart_food_items"
    core_mstr_united_kart_food_items_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    restaurant_id = Column(UUID(as_uuid=True), ForeignKey("core_mstr_united_kart_restaurants.core_mstr_united_kart_restaurants_id", ondelete="CASCADE"))
    category_id = Column(UUID(as_uuid=True), ForeignKey("core_mstr_united_kart_categories.core_mstr_united_kart_categories_id"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10, 2), nullable=False)
    discount_price = Column(DECIMAL(10, 2))
    image = Column(String(500))
    is_veg = Column(Boolean, default=True)
    ingredients = Column(Text)
    allergens = Column(Text)
    calories = Column(Integer)
    prep_time = Column(Integer)
    status = Column(Enum(FoodStatus), default=FoodStatus.available)
    rating = Column(DECIMAL(3, 2), default=0)
    total_ratings = Column(Integer, default=0)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class FoodVariant(Base):
    __tablename__ = "core_mstr_united_kart_food_variants"
    core_mstr_united_kart_food_variants_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    food_item_id = Column(UUID(as_uuid=True), ForeignKey("core_mstr_united_kart_food_items.core_mstr_united_kart_food_items_id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    price_adjustment = Column(DECIMAL(10, 2), default=0)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class OrderStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    preparing = "preparing"
    ready_for_pickup = "ready_for_pickup"
    picked_up = "picked_up"
    delivered = "delivered"
    cancelled = "cancelled"
    refunded = "refunded"

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"
    refunded = "refunded"

class PaymentMethod(str, enum.Enum):
    cash = "cash"
    card = "card"
    upi = "upi"
    wallet = "wallet"

class Order(Base):
    __tablename__ = "core_mstr_united_kart_orders"
    core_mstr_united_kart_orders_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True))
    restaurant_id = Column(UUID(as_uuid=True), ForeignKey("core_mstr_united_kart_restaurants.core_mstr_united_kart_restaurants_id"))
    delivery_partner_id = Column(UUID(as_uuid=True))
    delivery_address_id = Column(UUID(as_uuid=True))
    order_number = Column(String(50), unique=True, nullable=False)
    subtotal = Column(DECIMAL(10, 2), nullable=False)
    tax_amount = Column(DECIMAL(10, 2), default=0)  # GST
    delivery_fee = Column(DECIMAL(10, 2), default=0)
    discount_amount = Column(DECIMAL(10, 2), default=0)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    payment_method = Column(Enum(PaymentMethod))
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.pending)
    payment_id = Column(String(255))
    order_status = Column(Enum(OrderStatus), default=OrderStatus.pending)
    estimated_delivery_time = Column(DateTime)
    actual_delivery_time = Column(DateTime)
    special_instructions = Column(Text)
    cancellation_reason = Column(Text)
    rating = Column(Integer)
    review = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class OrderItem(Base):
    __tablename__ = "core_mstr_united_kart_order_items"
    core_mstr_united_kart_order_items_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("core_mstr_united_kart_orders.core_mstr_united_kart_orders_id", ondelete="CASCADE"))
    food_item_id = Column(UUID(as_uuid=True), ForeignKey("core_mstr_united_kart_food_items.core_mstr_united_kart_food_items_id"))
    variant_id = Column(UUID(as_uuid=True), ForeignKey("core_mstr_united_kart_food_variants.core_mstr_united_kart_food_variants_id"))
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    total_price = Column(DECIMAL(10, 2), nullable=False)
    special_instructions = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Review(Base):
    __tablename__ = "core_mstr_united_kart_reviews"
    core_mstr_united_kart_reviews_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True))
    customer_id = Column(UUID(as_uuid=True))
    restaurant_id = Column(UUID(as_uuid=True))
    delivery_partner_id = Column(UUID(as_uuid=True))
    rating = Column(Integer, nullable=False)
    review_text = Column(Text)
    review_type = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class CouponType(str, enum.Enum):
    percentage = "percentage"
    fixed_amount = "fixed_amount"
    free_delivery = "free_delivery"

class Coupon(Base):
    __tablename__ = "core_mstr_united_kart_coupons"
    core_mstr_united_kart_coupons_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(50), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    coupon_type = Column(Enum(CouponType), nullable=False)
    discount_value = Column(DECIMAL(10, 2), nullable=False)
    min_order_amount = Column(DECIMAL(10, 2), default=0)
    max_discount_amount = Column(DECIMAL(10, 2))
    usage_limit = Column(Integer)
    used_count = Column(Integer, default=0)
    valid_from = Column(DateTime, nullable=False)
    valid_until = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class NotificationType(str, enum.Enum):
    order_update = "order_update"
    promotion = "promotion"
    system = "system"

class Notification(Base):
    __tablename__ = "core_mstr_united_kart_notifications"
    core_mstr_united_kart_notifications_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True))
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(Enum(NotificationType), default=NotificationType.system)
    is_read = Column(Boolean, default=False)
    data_json = Column(Text)  # JSONB in DB
    created_at = Column(DateTime, default=datetime.utcnow) 