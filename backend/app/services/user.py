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

    clean_email = user_data.email.strip().lower()

    existing_user = (
        db.query(User)
        .filter(User.email.ilike(clean_email))
        .first()
    )

    if existing_user:
        raise ValueError("An account with this email address already exists. Please sign in.")

    # Enforce strict admin restriction
    is_admin = user_data.is_admin
    if is_admin and clean_email != "prianshumitraprivateserver1@gmail.com":
        is_admin = False

    user = User(
        email=clean_email,
        first_name=user_data.first_name.strip(),
        last_name=user_data.last_name.strip(),
        hashed_password=hash_password(user_data.password),
        is_admin=is_admin,
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