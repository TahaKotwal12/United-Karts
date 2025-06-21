# United Karts Restaurant Service - API Endpoints

This document provides a complete reference for all API endpoints in the restaurant microservice.

## Base URL
```
http://localhost:8001/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Login (Dummy endpoint for testing)
```http
POST /auth/login
```

**Request Body:**
```json
{
  "user_id": "admin1",
  "role": "admin",
  "password": "test"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user_id": "admin1",
  "role": "admin"
}
```

---

## 🏪 Restaurant Profile Endpoints

### Get Restaurant Profile
```http
GET /profile/{restaurant_id}
```

**Response:**
```json
{
  "id": "rest_001",
  "name": "Spice Garden",
  "description": "Authentic Indian cuisine",
  "phone": "+91-9876543210",
  "email": "contact@spicegarden.com",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400001",
    "country": "India"
  },
  "cuisine_type": "Indian",
  "rating": 4.5,
  "delivery_fee": 50.0,
  "min_order_amount": 100.0,
  "is_active": true,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

### Create Restaurant Profile
```http
POST /profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Spice Garden",
  "description": "Authentic Indian cuisine",
  "phone": "+91-9876543210",
  "email": "contact@spicegarden.com",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400001",
    "country": "India"
  },
  "cuisine_type": "Indian",
  "delivery_fee": 50.0,
  "min_order_amount": 100.0
}
```

### Update Restaurant Profile
```http
PUT /profile/{restaurant_id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Spice Garden Updated",
  "description": "Updated description",
  "phone": "+91-9876543211",
  "email": "new@spicegarden.com",
  "address": {
    "street": "456 New Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400002",
    "country": "India"
  },
  "cuisine_type": "Indian",
  "delivery_fee": 60.0,
  "min_order_amount": 150.0
}
```

### Delete Restaurant Profile
```http
DELETE /profile/{restaurant_id}
Authorization: Bearer <token>
```

---

## 🍽️ Menu Management Endpoints

### Get All Categories
```http
GET /menu/categories
```

**Response:**
```json
[
  {
    "id": "cat_001",
    "name": "Starters",
    "description": "Appetizers and starters",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

### Create Category
```http
POST /menu/categories
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Main Course",
  "description": "Main dishes"
}
```

### Update Category
```http
PUT /menu/categories/{category_id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Main Course Updated",
  "description": "Updated main dishes"
}
```

### Delete Category
```http
DELETE /menu/categories/{category_id}
Authorization: Bearer <token>
```

### Get All Food Items
```http
GET /menu/items
```

**Query Parameters:**
- `category_id` (optional): Filter by category
- `is_vegetarian` (optional): Filter by vegetarian status
- `is_available` (optional): Filter by availability

**Response:**
```json
[
  {
    "id": "item_001",
    "name": "Butter Chicken",
    "description": "Creamy and rich butter chicken",
    "price": 350.0,
    "category_id": "cat_001",
    "is_vegetarian": false,
    "is_available": true,
    "image_url": "https://example.com/butter-chicken.jpg",
    "preparation_time": 20,
    "spice_level": "Medium",
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

### Create Food Item
```http
POST /menu/items
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Butter Chicken",
  "description": "Creamy and rich butter chicken",
  "price": 350.0,
  "category_id": "cat_001",
  "is_vegetarian": false,
  "is_available": true,
  "image_url": "https://example.com/butter-chicken.jpg",
  "preparation_time": 20,
  "spice_level": "Medium"
}
```

### Update Food Item
```http
PUT /menu/items/{item_id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Butter Chicken Updated",
  "description": "Updated description",
  "price": 380.0,
  "category_id": "cat_001",
  "is_vegetarian": false,
  "is_available": true,
  "image_url": "https://example.com/butter-chicken-new.jpg",
  "preparation_time": 25,
  "spice_level": "Hot"
}
```

### Delete Food Item
```http
DELETE /menu/items/{item_id}
Authorization: Bearer <token>
```

### Get Food Item Variants
```http
GET /menu/items/{item_id}/variants
```

**Response:**
```json
[
  {
    "id": "var_001",
    "name": "Half Portion",
    "price_modifier": -100.0,
    "is_available": true,
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

### Create Food Item Variant
```http
POST /menu/items/{item_id}/variants
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Full Portion",
  "price_modifier": 50.0,
  "is_available": true
}
```

---

## 📦 Order Management Endpoints

### Get All Orders
```http
GET /orders
```

**Query Parameters:**
- `status` (optional): Filter by order status
- `restaurant_id` (optional): Filter by restaurant
- `date_from` (optional): Filter from date
- `date_to` (optional): Filter to date

**Response:**
```json
[
  {
    "id": "order_001",
    "restaurant_id": "rest_001",
    "customer_id": "cust_001",
    "items": [
      {
        "food_item_id": "item_001",
        "variant_id": "var_001",
        "quantity": 2,
        "unit_price": 250.0,
        "total_price": 500.0
      }
    ],
    "subtotal": 500.0,
    "delivery_fee": 50.0,
    "gst": 90.0,
    "total_amount": 640.0,
    "status": "confirmed",
    "payment_status": "pending",
    "delivery_address": {
      "street": "456 Customer Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postal_code": "400003",
      "country": "India"
    },
    "delivery_instructions": "Ring the bell twice",
    "estimated_delivery_time": "2024-01-01T12:00:00Z",
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

### Create Order
```http
POST /orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "restaurant_id": "rest_001",
  "customer_id": "cust_001",
  "items": [
    {
      "food_item_id": "item_001",
      "variant_id": "var_001",
      "quantity": 2
    }
  ],
  "delivery_address": {
    "street": "456 Customer Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400003",
    "country": "India"
  },
  "delivery_instructions": "Ring the bell twice"
}
```

### Get Order by ID
```http
GET /orders/{order_id}
```

### Update Order Status
```http
PUT /orders/{order_id}/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "preparing",
  "notes": "Order is being prepared"
}
```

### Assign Delivery Partner
```http
PUT /orders/{order_id}/assign-delivery
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "delivery_partner_id": "del_001",
  "estimated_delivery_time": "2024-01-01T12:00:00Z"
}
```

### Cancel Order
```http
PUT /orders/{order_id}/cancel
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Out of ingredients",
  "refund_amount": 640.0
}
```

---

## 💳 Payment Endpoints

### Create Payment Order
```http
POST /payment/create-order
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 64000,
  "currency": "INR",
  "order_id": "order_001",
  "customer_id": "cust_001"
}
```

**Response:**
```json
{
  "razorpay_order_id": "order_xxx",
  "amount": 64000,
  "currency": "INR",
  "key_id": "rzp_test_xxx"
}
```

### Verify Payment
```http
POST /payment/verify-payment
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "payment_id": "pay_xxx",
  "order_id": "order_xxx",
  "signature": "xxx"
}
```

**Response:**
```json
{
  "verified": true,
  "payment_id": "pay_xxx",
  "amount": 64000,
  "currency": "INR"
}
```

### Process Refund
```http
POST /payment/refund
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "payment_id": "pay_xxx",
  "amount": 64000,
  "reason": "Order cancelled"
}
```

**Response:**
```json
{
  "refund_id": "rfnd_xxx",
  "payment_id": "pay_xxx",
  "amount": 64000,
  "status": "processed"
}
```

---

## 📤 File Upload Endpoints

### Upload Image
```http
POST /upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Image file (JPEG, PNG, WebP, max 10MB)

**Response:**
```json
{
  "success": true,
  "url": "https://bucket.s3.amazonaws.com/image.jpg",
  "object_name": "image.jpg",
  "filename": "food-image.jpg",
  "size": 1024000
}
```

### Delete Image
```http
DELETE /upload/image/{object_name}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### List Images
```http
GET /upload/images
Authorization: Bearer <token>
```

**Query Parameters:**
- `prefix` (optional): Filter by prefix

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "name": "food-image.jpg",
      "size": 1024000,
      "last_modified": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### Get Image URL
```http
GET /upload/image/{object_name}/url
```

**Response:**
```json
{
  "url": "https://bucket.s3.amazonaws.com/image.jpg"
}
```

---

## 📊 Analytics Endpoints

### Get Revenue Analytics
```http
GET /analytics/revenue
```

**Query Parameters:**
- `restaurant_id` (optional): Filter by restaurant
- `date_from` (optional): Start date
- `date_to` (optional): End date
- `period` (optional): daily/weekly/monthly

**Response:**
```json
{
  "total_revenue": 50000.0,
  "total_orders": 100,
  "average_order_value": 500.0,
  "revenue_by_period": [
    {
      "period": "2024-01-01",
      "revenue": 5000.0,
      "orders": 10
    }
  ]
}
```

### Get Order Analytics
```http
GET /analytics/orders
```

**Response:**
```json
{
  "total_orders": 100,
  "pending_orders": 10,
  "completed_orders": 80,
  "cancelled_orders": 10,
  "orders_by_status": [
    {
      "status": "completed",
      "count": 80
    }
  ]
}
```

### Get Rating Analytics
```http
GET /analytics/ratings
```

**Response:**
```json
{
  "average_rating": 4.5,
  "total_reviews": 50,
  "rating_distribution": [
    {
      "rating": 5,
      "count": 30
    }
  ]
}
```

### Get Top Items
```http
GET /analytics/top-items
```

**Query Parameters:**
- `limit` (optional): Number of items (default: 10)

**Response:**
```json
[
  {
    "food_item_id": "item_001",
    "name": "Butter Chicken",
    "total_orders": 25,
    "total_revenue": 8750.0,
    "average_rating": 4.5
  }
]
```

---

## ⭐ Reviews Endpoints

### Get Reviews
```http
GET /reviews
```

**Query Parameters:**
- `restaurant_id` (optional): Filter by restaurant
- `food_item_id` (optional): Filter by food item
- `rating` (optional): Filter by rating

**Response:**
```json
[
  {
    "id": "rev_001",
    "restaurant_id": "rest_001",
    "food_item_id": "item_001",
    "customer_id": "cust_001",
    "rating": 5,
    "comment": "Excellent food!",
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

### Create Review
```http
POST /reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "restaurant_id": "rest_001",
  "food_item_id": "item_001",
  "customer_id": "cust_001",
  "rating": 5,
  "comment": "Excellent food!"
}
```

### Update Review
```http
PUT /reviews/{review_id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Good food, but could be better"
}
```

### Delete Review
```http
DELETE /reviews/{review_id}
Authorization: Bearer <token>
```

---

## 🎫 Coupons Endpoints

### Get Coupons
```http
GET /coupons
```

**Query Parameters:**
- `restaurant_id` (optional): Filter by restaurant
- `is_active` (optional): Filter by active status

**Response:**
```json
[
  {
    "id": "coupon_001",
    "code": "WELCOME20",
    "description": "20% off on first order",
    "discount_type": "percentage",
    "discount_value": 20.0,
    "min_order_amount": 200.0,
    "max_discount": 100.0,
    "usage_limit": 100,
    "used_count": 50,
    "valid_from": "2024-01-01T00:00:00Z",
    "valid_until": "2024-12-31T23:59:59Z",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

### Create Coupon
```http
POST /coupons
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "code": "WELCOME20",
  "description": "20% off on first order",
  "discount_type": "percentage",
  "discount_value": 20.0,
  "min_order_amount": 200.0,
  "max_discount": 100.0,
  "usage_limit": 100,
  "valid_from": "2024-01-01T00:00:00Z",
  "valid_until": "2024-12-31T23:59:59Z"
}
```

### Update Coupon
```http
PUT /coupons/{coupon_id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "description": "Updated description",
  "discount_value": 25.0,
  "max_discount": 150.0,
  "valid_until": "2024-12-31T23:59:59Z"
}
```

### Delete Coupon
```http
DELETE /coupons/{coupon_id}
Authorization: Bearer <token>
```

### Validate Coupon
```http
POST /coupons/validate
```

**Request Body:**
```json
{
  "code": "WELCOME20",
  "order_amount": 500.0,
  "customer_id": "cust_001"
}
```

**Response:**
```json
{
  "valid": true,
  "discount_amount": 100.0,
  "final_amount": 400.0,
  "message": "Coupon applied successfully"
}
```

---

## 🔔 Notifications Endpoints

### Get Notifications
```http
GET /notifications
```

**Query Parameters:**
- `restaurant_id` (optional): Filter by restaurant
- `type` (optional): Filter by notification type
- `is_read` (optional): Filter by read status

**Response:**
```json
[
  {
    "id": "notif_001",
    "restaurant_id": "rest_001",
    "type": "new_order",
    "title": "New Order Received",
    "message": "Order #123 has been placed",
    "data": {
      "order_id": "order_001",
      "amount": 640.0
    },
    "is_read": false,
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

### Create Notification
```http
POST /notifications
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "restaurant_id": "rest_001",
  "type": "new_order",
  "title": "New Order Received",
  "message": "Order #123 has been placed",
  "data": {
    "order_id": "order_001",
    "amount": 640.0
  }
}
```

### Mark Notification as Read
```http
PUT /notifications/{notification_id}/read
Authorization: Bearer <token>
```

### Delete Notification
```http
DELETE /notifications/{notification_id}
Authorization: Bearer <token>
```

---

## 🚀 Batch Jobs Endpoints

### Trigger Coupon Expiry Job
```http
POST /batch/coupon-expiry
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "expired_coupons": 5,
  "message": "Coupon expiry job completed"
}
```

### Trigger Analytics Aggregation
```http
POST /batch/analytics-aggregation
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "processed_records": 1000,
  "message": "Analytics aggregation completed"
}
```

### Trigger Notification Dispatch
```http
POST /batch/notification-dispatch
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "sent_notifications": 50,
  "message": "Notification dispatch completed"
}
```

---

## 📋 Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "detail": "Not authorized"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## 🔗 Related Documentation

- [Interactive API Docs](http://localhost:8001/docs)
- [OpenAPI Schema](http://localhost:8001/openapi.json)
- [Health Check](http://localhost:8001/health)
- [Main README](../README.md) 