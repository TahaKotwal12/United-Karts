# United Karts Backend

This backend is organized as a microservice architecture with three main services:

- `restaurant`: Handles all restaurant-related features (menu, orders, analytics, profile, etc.)
- `user`: Handles user management and authentication (boilerplate for now)
- `delivery_partner`: Handles delivery partner management (boilerplate for now)

Each service is a standalone FastAPI app, using async SQLAlchemy and JWT-based authentication where needed. Environment and dependency management is handled by `uv` and `.env` files.

## Structure

```
backend/
├── restaurant/
├── user/
├── delivery_partner/
└── README.md
```

## Setup

Each service contains its own `pyproject.toml`, `.env`, and `uv.yaml` for configuration and dependencies.

See the README in each service for details on running and developing that service. 