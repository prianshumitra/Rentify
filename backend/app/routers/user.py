from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserOut, UserLogin
from app.services.user import create_user, login_user


router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"],
)


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    try:
        user = create_user(
            db=db,
            user_data=user_data,
        )

        return user

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


from app.schemas.user import Token, UserCreate, UserOut, UserLogin, UserRoleUpdate
from app.services.user import create_user, authenticate_user, login_user
from app.core.security import create_access_token


@router.post(
    "/login",
    response_model=Token,
)
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db),
):
    try:
        user = authenticate_user(
            db=db,
            email=user_data.email,
            password=user_data.password,
        )
        access_token = create_access_token(
            user_id=str(user.id),
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get(
    "/me",
    response_model=UserOut,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.patch(
    "/me/role",
    response_model=UserOut,
)
def update_role(
    role_data: UserRoleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if role_data.is_vendor is not None:
        current_user.is_vendor = role_data.is_vendor
    if role_data.is_admin is not None:
        if role_data.is_admin and current_user.email.lower() != "prianshumitraprivateserver1@gmail.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access is strictly restricted to admin only.",
            )
        current_user.is_admin = role_data.is_admin

    db.commit()
    db.refresh(current_user)
    return current_user