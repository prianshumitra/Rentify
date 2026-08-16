from uuid import UUID

from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.user import User
from app.schemas.product import ProductCreate


def create_product(
    db: Session,
    product_data: ProductCreate,
    vendor: User,
) -> Product:

    existing_product = (
        db.query(Product)
        .filter(Product.slug == product_data.slug)
        .first()
    )

    if existing_product:
        raise ValueError(
            "A product with this slug already exists."
        )

    product = Product(
        vendor_id=vendor.id,
        name=product_data.name,
        slug=product_data.slug,
        description=product_data.description,
        category_id=product_data.category_id,
        is_active=True,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


def get_vendor_product(
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