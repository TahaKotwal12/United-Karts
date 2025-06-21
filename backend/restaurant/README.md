# United Karts Restaurant Microservice

This is the **restaurant microservice** for the United Karts food delivery platform, built for Indian users. It provides all restaurant-related APIs, JWT authentication, Razorpay payment integration, S3/MinIO image storage, and background batch jobs.

---

## Features
- Restaurant profile management (with Indian phone/address validation)
- Menu management (categories, food items, variants)
- Order management (CRUD, status, delivery, Indian payment, GST)
- Analytics (revenue, orders, ratings, top items, etc.)
- Reviews & ratings
- Coupons & offers (with expiry, validation)
- Notifications
- **Razorpay payment integration** (create orders, verify payments, refunds)
- **S3/MinIO image storage** (upload, delete, list images)
- JWT authentication (admin/restaurant_owner roles)
- Batch/background jobs (coupon expiry, analytics, notifications)
- Indian localization (INR, phone/address, GST, UPI, etc.)

---

## Requirements
- Python 3.10+
- PostgreSQL
- [uv](https://github.com/astral-sh/uv) (for process management)
- MinIO (for local development) or AWS S3 (for production)

---

## Setup

1. **Install dependencies:**
   ```bash
   cd backend/restaurant
   uv pip install --system --requirements pyproject.toml
   ```

2. **Configure environment:**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your actual values
   nano .env
   ```
   
   **Required environment variables:**
   ```env
   # Database Configuration
   DATABASE_URL=postgresql+asyncpg://unitedkarts:password@localhost:5432/unitedkarts
   
   # JWT Authentication
   JWT_SECRET=your_super_secret_jwt_key
   JWT_ALGORITHM=HS256
   
   # Razorpay Payment Gateway
   RAZORPAY_KEY_ID=rzp_test_your_test_key_id
   RAZORPAY_KEY_SECRET=your_test_key_secret
   
   # S3/MinIO Configuration
   AWS_ACCESS_KEY_ID=minioadmin
   AWS_SECRET_ACCESS_KEY=minioadmin
   AWS_REGION=us-east-1
   AWS_BUCKET_NAME=united-karts-images
   AWS_ENDPOINT_URL=http://localhost:9000
   AWS_USE_SSL=false
   
   # Environment
   ENVIRONMENT=development
   ```

3. **Setup MinIO (for local development):**
   ```bash
   # Install MinIO
   wget https://dl.min.io/server/minio/release/linux-amd64/minio
   chmod +x minio
   ./minio server /data --console-address ":9001"
   
   # Create bucket
   mc alias set myminio http://localhost:9000 minioadmin minioadmin
   mc mb myminio/united-karts-images
   ```

4. **Run migrations:**
   - (Use Alembic or your preferred tool to create DB tables from models.)

5. **Start the service (API + batch jobs):**
   ```bash
   uv start
   ```
   - The API will run on [http://localhost:8001](http://localhost:8001)
   - Batch jobs (coupon expiry, analytics, notifications) run in parallel.

---

## Environment Variables

### Required Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `RAZORPAY_KEY_ID`: Your Razorpay test/live key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay test/live key secret
- `AWS_ACCESS_KEY_ID`: S3/MinIO access key
- `AWS_SECRET_ACCESS_KEY`: S3/MinIO secret key

### Optional Variables (with defaults)
- `ENVIRONMENT`: development/production (default: development)
- `AWS_BUCKET_NAME`: S3/MinIO bucket name (default: united-karts-images)
- `AWS_ENDPOINT_URL`: MinIO endpoint for local development
- `GST_PERCENTAGE`: Indian GST percentage (default: 18.0)
- `DEFAULT_DELIVERY_FEE`: Default delivery fee in INR (default: 50.0)
- `MIN_ORDER_AMOUNT`: Minimum order amount in INR (default: 100.0)
- `MAX_FILE_SIZE`: Maximum file upload size in bytes (default: 10MB)

---

## JWT Authentication
- Obtain a token via `/api/auth/login` (dummy endpoint for testing):
  ```bash
  curl -X POST http://localhost:8001/api/auth/login \
    -H 'Content-Type: application/json' \
    -d '{"user_id": "admin1", "role": "admin", "password": "test"}'
  ```
- Use the returned `access_token` as a Bearer token in all write requests:
  ```bash
  curl -H "Authorization: Bearer <token>" ...
  ```
- Only `admin` and `restaurant_owner` roles can create/update/delete.

---

## Razorpay Integration
- **Create payment order:**
  ```bash
  curl -X POST http://localhost:8001/api/payment/create-order \
    -H "Authorization: Bearer <token>" \
    -H 'Content-Type: application/json' \
    -d '{"amount": 100000, "currency": "INR"}'  # Amount in paise
  ```
- **Verify payment:**
  ```bash
  curl -X POST http://localhost:8001/api/payment/verify-payment \
    -H "Authorization: Bearer <token>" \
    -H 'Content-Type: application/json' \
    -d '{"payment_id": "pay_xxx", "order_id": "order_xxx", "signature": "xxx"}'
  ```
- **Process refund:**
  ```bash
  curl -X POST http://localhost:8001/api/payment/refund \
    -H "Authorization: Bearer <token>" \
    -H 'Content-Type: application/json' \
    -d '{"payment_id": "pay_xxx", "amount": 50000}'
  ```

---

## Image Upload (S3/MinIO)
- **Upload image:**
  ```bash
  curl -X POST http://localhost:8001/api/upload/image \
    -H "Authorization: Bearer <token>" \
    -F "file=@/path/to/image.jpg"
  ```
- **Delete image:**
  ```bash
  curl -X DELETE http://localhost:8001/api/upload/image/object_name \
    -H "Authorization: Bearer <token>"
  ```
- **List images:**
  ```bash
  curl http://localhost:8001/api/upload/images \
    -H "Authorization: Bearer <token>"
  ```

---

## API Documentation
- Interactive docs: [http://localhost:8001/docs](http://localhost:8001/docs)
- OpenAPI schema: [http://localhost:8001/openapi.json](http://localhost:8001/openapi.json)
- Health check: [http://localhost:8001/health](http://localhost:8001/health)

---

## Example API Usage
- **Get restaurant profile:**
  ```bash
  curl http://localhost:8001/api/profile/<restaurant_id>
  ```
- **Create food item:**
  ```bash
  curl -X POST http://localhost:8001/api/menu/items \
    -H "Authorization: Bearer <token>" \
    -H 'Content-Type: application/json' \
    -d '{...}'
  ```
- **Deactivate expired coupons:** (runs automatically in batch)

---

## Indian Localization Notes
- All currency is in INR (₹)
- Phone and postal code validation is Indian-specific
- GST is supported in order/tax fields
- UPI, wallet, and card payment methods supported
- Razorpay integration for seamless Indian payments

---

## Extending
- Add more batch jobs in `batch/batch_jobs.py`
- Add new endpoints in `app/api/`
- Add new business logic in `app/services/`

---

## Contact & Support
- For issues, open a ticket in the main repo or contact the United Karts backend team. 