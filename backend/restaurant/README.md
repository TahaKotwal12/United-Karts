# United Karts Restaurant Microservice

This is the **restaurant microservice** for the United Karts food delivery platform, built for Indian users. It provides all restaurant-related APIs, JWT authentication, and background batch jobs.

---

## Features
- Restaurant profile management (with Indian phone/address validation)
- Menu management (categories, food items, variants)
- Order management (CRUD, status, delivery, Indian payment, GST)
- Analytics (revenue, orders, ratings, top items, etc.)
- Reviews & ratings
- Coupons & offers (with expiry, validation)
- Notifications
- JWT authentication (admin/restaurant_owner roles)
- Batch/background jobs (coupon expiry, analytics, notifications)
- Indian localization (INR, phone/address, GST, UPI, etc.)

---

## Requirements
- Python 3.10+
- PostgreSQL
- [uv](https://github.com/astral-sh/uv) (for process management)

---

## Setup

1. **Install dependencies:**
   ```bash
   cd backend/restaurant
   uv pip install --system --requirements pyproject.toml
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env` and set your DB/JWT values.
   - Example:
     ```env
     DATABASE_URL=postgresql+asyncpg://unitedkarts:password@localhost:5432/unitedkarts
     JWT_SECRET=supersecretkey
     JWT_ALGORITHM=HS256
     ```

3. **Run migrations:**
   - (Use Alembic or your preferred tool to create DB tables from models.)

4. **Start the service (API + batch jobs):**
   ```bash
   uv start
   ```
   - The API will run on [http://localhost:8001](http://localhost:8001)
   - Batch jobs (coupon expiry, analytics, notifications) run in parallel.

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

## API Documentation
- Interactive docs: [http://localhost:8001/docs](http://localhost:8001/docs)
- OpenAPI schema: [http://localhost:8001/openapi.json](http://localhost:8001/openapi.json)

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

---

## Extending
- Add more batch jobs in `batch/batch_jobs.py`
- Add new endpoints in `app/api/`
- Add new business logic in `app/services/`

---

## Contact & Support
- For issues, open a ticket in the main repo or contact the United Karts backend team. 