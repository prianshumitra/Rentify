from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_vendor
from app.db.session import get_db
from app.models.user import User
from app.schemas.inventory import (
    InventoryItemCreate,
    InventoryItemOut,
    InventoryItemUpdate,
)
from app.services.inventory import (
    create_inventory_item,
    get_inventory_item,
    list_inventory_items,
    retire_inventory_item,
    update_inventory_item,
)

router = APIRouter(
    prefix="/api/v1/variants",
    tags=["Inventory"],
)


@router.post(
    "/{variant_id}/inventory",
    response_model=InventoryItemOut,
    status_code=status.HTTP_201_CREATED,
)
def create_inventory_item_endpoint(
    variant_id: UUID,
    inventory_data: InventoryItemCreate,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        return create_inventory_item(
            db=db,
            variant_id=variant_id,
            inventory_data=inventory_data,
            vendor=current_vendor,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "/{variant_id}/inventory",
    response_model=list[InventoryItemOut],
)
def list_inventory_items_endpoint(
    variant_id: UUID,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        return list_inventory_items(
            db=db,
            variant_id=variant_id,
            vendor=current_vendor,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.get(
    "/{variant_id}/inventory/{inventory_id}",
    response_model=InventoryItemOut,
)
def get_inventory_item_endpoint(
    variant_id: UUID,
    inventory_id: UUID,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        return get_inventory_item(
            db=db,
            variant_id=variant_id,
            inventory_id=inventory_id,
            vendor=current_vendor,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.patch(
    "/{variant_id}/inventory/{inventory_id}",
    response_model=InventoryItemOut,
)
def update_inventory_item_endpoint(
    variant_id: UUID,
    inventory_id: UUID,
    inventory_data: InventoryItemUpdate,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        return update_inventory_item(
            db=db,
            variant_id=variant_id,
            inventory_id=inventory_id,
            inventory_data=inventory_data,
            vendor=current_vendor,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.delete(
    "/{variant_id}/inventory/{inventory_id}",
    response_model=InventoryItemOut,
)
def retire_inventory_item_endpoint(
    variant_id: UUID,
    inventory_id: UUID,
    current_vendor: User = Depends(get_current_vendor),
    db: Session = Depends(get_db),
):
    try:
        return retire_inventory_item(
            db=db,
            variant_id=variant_id,
            inventory_id=inventory_id,
            vendor=current_vendor,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )