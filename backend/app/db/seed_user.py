from app.db.session import SessionLocal
from app.models.user import User


def seed_user():
    db = SessionLocal()

    try:
        user = User(
            email="test@rentify.com",
            password_hash="temporary-hash",
            first_name="Test",
            last_name="Customer",
            role="customer",
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        print(f"Test user created: {user.id}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_user()