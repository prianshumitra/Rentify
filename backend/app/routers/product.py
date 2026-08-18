from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    get_current_user,
    get_current_vendor,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.product import (
    ProductCreate,
    ProductOut,
    ProductUpdate,
)
from app.services.product import (
    create_product,
    deactivate_product,
    get_product_by_id,
    get_vendor_product,
    list_products,
    update_product,
)

router = APIRouter(
    prefix="/api/v1/products",
    tags=["Products"],
)


@router.post(
    "",
    response_model=ProductOut,
    status_code=status.HTTP_201_CREATED,
)
def create_product_endpoint(
    product_data: ProductCreate,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        product = create_product(
            db=db,
            product_data=product_data,
            vendor=current_vendor,
        )

        return product

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "",
    response_model=list[ProductOut],
)
def list_products_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list_products(
        db=db,
        current_user=current_user,
    )


@router.get(
    "/{product_id}",
    response_model=ProductOut,
)
def get_product_endpoint(
    product_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        product = get_product_by_id(
            db=db,
            product_id=product_id,
        )

        return product

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.patch(
    "/{product_id}",
    response_model=ProductOut,
)
def update_product_endpoint(
    product_id: UUID,
    product_data: ProductUpdate,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        product = update_product(
            db=db,
            product_id=product_id,
            product_data=product_data,
            vendor=current_vendor,
        )

        return product

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.delete(
    "/{product_id}",
    response_model=ProductOut,
)
def deactivate_product_endpoint(
    product_id: UUID,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        product = deactivate_product(
            db=db,
            product_id=product_id,
            vendor=current_vendor,
        )

        return product

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )