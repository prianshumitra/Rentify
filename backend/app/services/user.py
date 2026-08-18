from uuid import UUID

from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.user import UserCreate


def create_user(
    db: Session,
    user_data: UserCreate,
) -> User:

    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise ValueError("A user with this email already exists.")

    user = User(
        email=user_data.email,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        hashed_password=hash_password(user_data.password),
        is_admin=user_data.is_admin,
        is_vendor=user_data.is_vendor,
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User:

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        raise ValueError("Invalid email or password.")

    if not user.is_active:
        raise ValueError("User account is inactive.")

    if not verify_password(
        password,
        user.hashed_password,
    ):
        raise ValueError("Invalid email or password.")

    return user


def login_user(
    db: Session,
    email: str,
    password: str,
) -> str:

    user = authenticate_user(
        db=db,
        email=email,
        password=password,
    )

    return create_access_token(
        user_id=str(user.id),
    )