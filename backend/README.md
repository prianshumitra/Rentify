# Rentify Backend

Backend API for **Rentify**, a rental management platform built with FastAPI and PostgreSQL.

Rentify handles user authentication, vendor-owned products, inventory, rental management, rental lifecycle operations, availability, payments, returns, inspections, damage assessment, and late-fee processing.

> **Status:** Active development

---

## 🚀 Features

### Authentication & Authorization

- JWT-based authentication
- User registration and login
- Password hashing using Argon2 via `pwdlib`
- Authenticated-user dependency
- Admin authorization
- Vendor authorization
- User account activation/deactivation

### Vendor System

- Users can have vendor capabilities through `is_vendor`
- Vendors can create products
- Products are owned by vendors through `vendor_id`
- Vendor ownership is enforced server-side
- A vendor can also act as a customer

### Product & Inventory

- Product categories
- Products
- Product variants
- Physical inventory items
- Inventory status tracking
- SKU, asset-code, and serial-number support

### Rentals

- Rental creation
- Rental ownership
- Rental lifecycle management
- Rental status transitions
- Rental cancellation
- Rental pricing
- Inventory allocation
- Availability checking

### Payments

- Stripe integration
- Rental payments
- Late-fee payments
- Payment intents
- Stripe webhook handling
- Refund handling for applicable cancellations

### Returns & Damage

- Rental return processing
- Return inspections
- Damage assessments
- Damage-related charges

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend language |
| FastAPI | REST API framework |
| PostgreSQL | Database |
| SQLAlchemy 2.0 | ORM |
| Alembic | Database migrations |
| Pydantic | Request/response validation |
| Pydantic Settings | Environment configuration |
| PyJWT | JWT authentication |
| pwdlib + Argon2 | Password hashing |
| Stripe | Payment processing |
| Uvicorn | ASGI server |

---

## 🏗️ Architecture

Rentify follows a layered backend architecture:

```text
                    HTTP Request
                         │
                         ▼
                      Router
                         │
                         ▼
                       Schema
                         │
                         ▼
                      Service
                         │
                         ▼
                       Model
                         │
                         ▼
                     PostgreSQL
```

## 📂 Project Structure

```text
backend/
├── alembic/             # Database migrations
├── app/
│   ├── core/            # Config, security, and global settings
│   ├── db/              # Session management and seed scripts
│   ├── models/          # SQLAlchemy models
│   ├── routers/         # API endpoints
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   └── main.py          # Application entry point
├── tests/               # Testing suite
├── alembic.ini          # Alembic configuration
├── .env.example         # Template for environment variables
└── requirements.txt     # Project dependencies
```

---

## 🔑 Authentication & Authorization

Rentify uses JWT (JSON Web Tokens) for secure authentication.

- **Endpoints**:
  - `POST /api/v1/users/register`: Register a new user.
  - `POST /api/v1/users/login`: Authenticate and receive a JWT access token.
- **Roles**:
  - **Customer**: Default role, can browse and rent products.
  - **Vendor**: Can manage their own inventory and products.
  - **Admin**: Full access to all system data and configurations.
- **Authorization**: Reusable dependencies (`get_current_user`, `get_current_vendor`, `get_current_admin`) enforce access control at the router level.

---

## 👤 User / Vendor / Admin Model

Users are represented by the `User` model, which includes:
- `is_admin`: Boolean flag for administrative privileges.
- `is_vendor`: Boolean flag allowing product and inventory management.
- A vendor can also act as a customer, but they are prohibited from renting their own products.

---

## 📦 Product & Inventory Architecture

- **Category**: Hierarchical organization of products.
- **Product**: Owned by a Vendor (`vendor_id`).
- **ProductVariant**: Specific versions of a product (e.g., color, size, SKU).
- **InventoryItem**: Physical assets tracked by `asset_code` and `serial_number`.
- **PriceList & RentalRate**: Flexible pricing structures (hourly, daily, weekly, monthly).

---

## 📋 Rental System

The `Rental` service handles complex coordination between users, variants, and inventory.

- **Creation**: Validates availability, calculates subtotals, creates `RentalItem` and `InventoryAllocation`.
- **Ownership Check**: Ensures only the customer or an admin can manage a specific rental.
- **Self-Renting Prevention**: Backend validation prevents vendors from renting products they own.

---

## 🔄 Rental Lifecycle

Rentals follow a strict state machine:
`DRAFT` → `PENDING_PAYMENT` → `CONFIRMED` → `READY_FOR_PICKUP` → `ACTIVE` → `RETURN_PENDING` → `RETURNED` → `COMPLETED`

- **Overdue**: Rentals transition to `OVERDUE` if not returned by the `end_at` time.
- **Cancellation**: Supported from `CONFIRMED` or `READY_FOR_PICKUP` statuses, with automated refund processing if paid.

---

## 📅 Availability

The availability system checks for physical `InventoryItem` records that are not currently allocated to any other rental during the requested time window.
- **Endpoint**: `GET /api/v1/availability/{variant_id}`

---

## 💳 Payments & Stripe

Integrated with Stripe for secure transaction handling.

- **Payment Types**: `RENTAL`, `LATE_FEE`, `DAMAGE_CHARGE`.
- **Flow**: Creates a Stripe `PaymentIntent`. The status is updated to `PAID` via the `/api/v1/payments/webhook` endpoint upon successful processing.
- **Refunds**: Automatically triggered during rental cancellation if the payment was already successful.

---

## ⏳ Late Fees

Overdue rentals are processed via a system endpoint:
- **Calculation**: Based on rental amount and duration of delay.
- **Endpoint**: `POST /api/v1/rentals/mark-overdue`

---

## 🔙 Returns & Damage Assessment

A structured return process ensures inventory integrity:
1. **Return**: `POST /api/v1/rentals/{rental_id}/return` (updates status and releases inventory).
2. **Inspection**: `POST /api/v1/rentals/{rental_id}/inspection` (captures condition and notes).
3. **Damage Assessment**: `POST /api/v1/rentals/{rental_id}/damage-assessment` (records severity and estimated charges).

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and configure the following:

- `DATABASE_URL`: PostgreSQL connection string.
- `SECRET_KEY`: JWT signing key.
- `ALGORITHM`: JWT algorithm (default: HS256).
- `STRIPE_SECRET_KEY`: Your Stripe secret API key.
- `STRIPE_WEBHOOK_SECRET`: Secret for validating Stripe webhooks.

---

## 🛠️ Local Setup

1. **Clone the repository**.
2. **Create a virtual environment**: `python -m venv venv`.
3. **Install dependencies**: `pip install -r requirements.txt`.
4. **Configure the database**: Ensure PostgreSQL is running and update `DATABASE_URL` in `.env`.
5. **Run migrations**: `alembic upgrade head`.
6. **Seed data**: `python -m app.db.seed_user` followed by `python -m app.db.seed`.

---

## 🏃 Running the Application

Start the backend server using uvicorn:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

---

## 📖 API Documentation

- **Interactive Docs (Swagger UI)**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

---

## 🧪 Testing

Rentify uses `pytest` for testing.
To run tests:
```bash
pytest
```

---

## 🔒 Security

- **Password Hashing**: Argon2 (via pwdlib).
- **JWT Protection**: All sensitive endpoints require a valid Bearer token.
- **Ownership Enforcement**: Users cannot access or modify rentals/products that do not belong to them unless they have Admin privileges.

---

## 🗺️ Roadmap

- [ ] Multi-currency support for international rentals.
- [ ] Automated email/SMS notifications for rental status changes.
- [ ] Vendor dashboard with earnings analytics.
- [ ] Advanced search and filtering for rentable products.
- [ ] Mobile application for easier inventory scanning.

---

## 📄 License

This project is proprietary. All rights reserved.
