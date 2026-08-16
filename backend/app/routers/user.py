from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
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


@router.post(
    "/login",
    response_model=Token,
)
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db),
):
    try:
        access_token = login_user(
            db=db,
            email=user_data.email,
            password=user_data.password,
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={"WWW-Authenticate": "Bearer"},
        )