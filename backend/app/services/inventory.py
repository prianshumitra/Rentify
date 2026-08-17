from uuid import UUID

from sqlalchemy.orm import Session

from app.models.inventory import InventoryItem, InventoryStatus
from app.models.product_variant import ProductVariant
from app.models.user import User
from app.services.product_variant import get_owned_product
from app.schemas.inventory import InventoryItemCreate, InventoryItemUpdate


def get_owned_variant(
    db: Session,
    variant_id: UUID,
    vendor: User,
) -> ProductVariant:

    variant = db.get(ProductVariant, variant_id)

    if variant is None:
        raise ValueError("Product variant not found.")

    get_owned_product(
        db=db,
        product_id=variant.product_id,
        vendor=vendor,
    )

    return variant


def create_inventory_item(
    db: Session,
    variant_id: UUID,
    inventory_data: InventoryItemCreate,
    vendor: User,
) -> InventoryItem:

    variant = get_owned_variant(
        db=db,
        variant_id=variant_id,
        vendor=vendor,
    )

    if not variant.is_active:
        raise ValueError(
            "Cannot add inventory to an inactive variant."
        )

    existing_asset = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.asset_code
            == inventory_data.asset_code
        )
        .first()
    )

    if existing_asset:
        raise ValueError(
            "An inventory item with this asset code already exists."
        )

    if inventory_data.serial_number is not None:
        existing_serial = (
            db.query(InventoryItem)
            .filter(
                InventoryItem.serial_number
                == inventory_data.serial_number
            )
            .first()
        )

        if existing_serial:
            raise ValueError(
                "An inventory item with this serial number already exists."
            )

    inventory_item = InventoryItem(
        variant_id=variant.id,
        asset_code=inventory_data.asset_code,
        serial_number=inventory_data.serial_number,
        status=InventoryStatus.AVAILABLE,
    )

    db.add(inventory_item)
    db.commit()
    db.refresh(inventory_item)

    return inventory_item


def list_inventory_items(
    db: Session,
    variant_id: UUID,
    vendor: User,
) -> list[InventoryItem]:

    variant = get_owned_variant(
        db=db,
        variant_id=variant_id,
        vendor=vendor,
    )

    return (
        db.query(InventoryItem)
        .filter(
            InventoryItem.variant_id == variant.id,
        )
        .all()
    )


def get_inventory_item(
    db: Session,
    variant_id: UUID,
    inventory_id: UUID,
    vendor: User,
) -> InventoryItem:

    get_owned_variant(
        db=db,
        variant_id=variant_id,
        vendor=vendor,
    )

    inventory_item = db.get(
        InventoryItem,
        inventory_id,
    )

    if (
        inventory_item is None
        or inventory_item.variant_id != variant_id
    ):
        raise ValueError("Inventory item not found.")

    return inventory_item


def update_inventory_item(
    db: Session,
    variant_id: UUID,
    inventory_id: UUID,
    inventory_data: InventoryItemUpdate,
    vendor: User,
) -> InventoryItem:

    inventory_item = get_inventory_item(
        db=db,
        variant_id=variant_id,
        inventory_id=inventory_id,
        vendor=vendor,
    )

    if inventory_data.asset_code is not None:
        existing_asset = (
            db.query(InventoryItem)
            .filter(
                InventoryItem.asset_code
                == inventory_data.asset_code,
                InventoryItem.id != inventory_id,
            )
            .first()
        )

        if existing_asset:
            raise ValueError(
                "An inventory item with this asset code already exists."
            )

    if inventory_data.serial_number is not None:
        existing_serial = (
            db.query(InventoryItem)
            .filter(
                InventoryItem.serial_number
                == inventory_data.serial_number,
                InventoryItem.id != inventory_id,
            )
            .first()
        )

        if existing_serial:
            raise ValueError(
                "An inventory item with this serial number already exists."
            )

    update_data = inventory_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(inventory_item, field, value)

    db.commit()
    db.refresh(inventory_item)

    return inventory_item


def retire_inventory_item(
    db: Session,
    variant_id: UUID,
    inventory_id: UUID,
    vendor: User,
) -> InventoryItem:

    inventory_item = get_inventory_item(
        db=db,
        variant_id=variant_id,
        inventory_id=inventory_id,
        vendor=vendor,
    )

    if inventory_item.status == InventoryStatus.RETIRED:
        raise ValueError(
            "Inventory item is already retired."
        )

    if inventory_item.status in {
        InventoryStatus.RENTED,
        InventoryStatus.RESERVED,
    }:
        raise ValueError(
            "Cannot retire an inventory item that is rented or reserved."
        )

    inventory_item.status = InventoryStatus.RETIRED

    db.commit()
    db.refresh(inventory_item)

    return inventory_item