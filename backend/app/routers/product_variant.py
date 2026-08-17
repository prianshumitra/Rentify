from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_vendor
from app.db.session import get_db
from app.models.user import User
from app.schemas.product_variant import (
    ProductVariantCreate,
    ProductVariantOut,
    ProductVariantUpdate,
)
from app.services.product_variant import (
    create_product_variant,
    deactivate_product_variant,
    get_product_variant,
    list_product_variants,
    update_product_variant,
)

router = APIRouter(
    prefix="/api/v1/products",
    tags=["Product Variants"],
)


@router.post(
    "/{product_id}/variants",
    response_model=ProductVariantOut,
    status_code=status.HTTP_201_CREATED,
)
def create_product_variant_endpoint(
    product_id: UUID,
    variant_data: ProductVariantCreate,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        return create_product_variant(
            db=db,
            product_id=product_id,
            variant_data=variant_data,
            vendor=current_vendor,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "/{product_id}/variants",
    response_model=list[ProductVariantOut],
)
def list_product_variants_endpoint(
    product_id: UUID,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        return list_product_variants(
            db=db,
            product_id=product_id,
            vendor=current_vendor,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.get(
    "/{product_id}/variants/{variant_id}",
    response_model=ProductVariantOut,
)
def get_product_variant_endpoint(
    product_id: UUID,
    variant_id: UUID,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        return get_product_variant(
            db=db,
            product_id=product_id,
            variant_id=variant_id,
            vendor=current_vendor,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.patch(
    "/{product_id}/variants/{variant_id}",
    response_model=ProductVariantOut,
)
def update_product_variant_endpoint(
    product_id: UUID,
    variant_id: UUID,
    variant_data: ProductVariantUpdate,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        return update_product_variant(
            db=db,
            product_id=product_id,
            variant_id=variant_id,
            variant_data=variant_data,
            vendor=current_vendor,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.delete(
    "/{product_id}/variants/{variant_id}",
    response_model=ProductVariantOut,
)
def deactivate_product_variant_endpoint(
    product_id: UUID,
    variant_id: UUID,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        return deactivate_product_variant(
            db=db,
            product_id=product_id,
            variant_id=variant_id,
            vendor=current_vendor,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )