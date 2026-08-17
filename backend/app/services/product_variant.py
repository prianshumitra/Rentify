from uuid import UUID

from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.user import User
from app.schemas.product_variant import (
    ProductVariantCreate,
    ProductVariantUpdate,
)


def get_owned_product(
    db: Session,
    product_id: UUID,
    vendor: User,
) -> Product:

    product = db.get(Product, product_id)

    if product is None:
        raise ValueError("Product not found.")

    if not vendor.is_admin and product.vendor_id != vendor.id:
        raise ValueError(
            "You do not have permission to manage this product."
        )

    return product


def create_product_variant(
    db: Session,
    product_id: UUID,
    variant_data: ProductVariantCreate,
    vendor: User,
) -> ProductVariant:

    product = get_owned_product(
        db=db,
        product_id=product_id,
        vendor=vendor,
    )

    if not product.is_active:
        raise ValueError(
            "Cannot add a variant to an inactive product."
        )

    existing_variant = (
        db.query(ProductVariant)
        .filter(ProductVariant.sku == variant_data.sku)
        .first()
    )

    if existing_variant:
        raise ValueError(
            "A variant with this SKU already exists."
        )

    variant = ProductVariant(
        product_id=product.id,
        sku=variant_data.sku,
        brand=variant_data.brand,
        manufacturer=variant_data.manufacturer,
        color=variant_data.color,
        size=variant_data.size,
        is_active=True,
    )

    db.add(variant)
    db.commit()
    db.refresh(variant)

    return variant


def list_product_variants(
    db: Session,
    product_id: UUID,
    vendor: User,
) -> list[ProductVariant]:

    product = get_owned_product(
        db=db,
        product_id=product_id,
        vendor=vendor,
    )

    return (
        db.query(ProductVariant)
        .filter(
            ProductVariant.product_id == product.id,
            ProductVariant.is_active.is_(True),
        )
        .all()
    )


def get_product_variant(
    db: Session,
    product_id: UUID,
    variant_id: UUID,
    vendor: User,
) -> ProductVariant:

    get_owned_product(
        db=db,
        product_id=product_id,
        vendor=vendor,
    )

    variant = db.get(ProductVariant, variant_id)

    if variant is None or variant.product_id != product_id:
        raise ValueError("Product variant not found.")

    return variant


def update_product_variant(
    db: Session,
    product_id: UUID,
    variant_id: UUID,
    variant_data: ProductVariantUpdate,
    vendor: User,
) -> ProductVariant:

    variant = get_product_variant(
        db=db,
        product_id=product_id,
        variant_id=variant_id,
        vendor=vendor,
    )

    if variant_data.sku is not None:
        existing_variant = (
            db.query(ProductVariant)
            .filter(
                ProductVariant.sku == variant_data.sku,
                ProductVariant.id != variant_id,
            )
            .first()
        )

        if existing_variant:
            raise ValueError(
                "A variant with this SKU already exists."
            )

    update_data = variant_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(variant, field, value)

    db.commit()
    db.refresh(variant)

    return variant


def deactivate_product_variant(
    db: Session,
    product_id: UUID,
    variant_id: UUID,
    vendor: User,
) -> ProductVariant:

    variant = get_product_variant(
        db=db,
        product_id=product_id,
        variant_id=variant_id,
        vendor=vendor,
    )

    if not variant.is_active:
        raise ValueError(
            "Product variant is already inactive."
        )

    variant.is_active = False

    db.commit()
    db.refresh(variant)

    return variant