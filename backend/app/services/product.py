from uuid import UUID

from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.user import User
from app.schemas.product import ProductCreate, ProductUpdate


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


def get_product_by_id(
    db: Session,
    product_id: UUID,
) -> Product:

    product = db.get(Product, product_id)

    if product is None or not product.is_active:
        raise ValueError("Product not found or inactive.")

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


def list_products(
    db: Session,
    current_user: User,
) -> list[Product]:

    query = (
        db.query(Product)
        .filter(Product.is_active.is_(True))
    )

    if current_user.is_vendor:
        query = query.filter(
            Product.vendor_id != current_user.id
        )

    return query.all()


def update_product(
    db: Session,
    product_id: UUID,
    product_data: ProductUpdate,
    vendor: User,
) -> Product:

    product = db.get(Product, product_id)

    if product is None:
        raise ValueError("Product not found.")

    if not vendor.is_admin and product.vendor_id != vendor.id:
        raise ValueError(
            "You do not have permission to manage this product."
        )

    if product_data.slug is not None:
        existing_product = (
            db.query(Product)
            .filter(
                Product.slug == product_data.slug,
                Product.id != product_id,
            )
            .first()
        )

        if existing_product:
            raise ValueError(
                "A product with this slug already exists."
            )

    update_data = product_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product


def deactivate_product(
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

    if not product.is_active:
        raise ValueError("Product is already inactive.")

    product.is_active = False

    db.commit()
    db.refresh(product)

    return product