from app.db.session import SessionLocal
from app.models.category import Category
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.inventory import InventoryItem


def seed():
    db = SessionLocal()

    try:
        category = Category(
            name="Cameras",
            slug="cameras",
            description="Cameras available for rental",
        )

        db.add(category)
        db.flush()

        product = Product(
            name="Canon EOS R6",
            slug="canon-eos-r6",
            description="Full-frame mirrorless camera",
            category_id=category.id,
        )

        db.add(product)
        db.flush()

        variant = ProductVariant(
            product_id=product.id,
            sku="CANON-R6-BODY",
            brand="Canon",
            manufacturer="Canon Inc.",
            color="Black",
        )

        db.add(variant)
        db.flush()

        inventory_items = [
            InventoryItem(
                variant_id=variant.id,
                asset_code="CAM-001",
                serial_number="R6-001",
            ),
            InventoryItem(
                variant_id=variant.id,
                asset_code="CAM-002",
                serial_number="R6-002",
            ),
            InventoryItem(
                variant_id=variant.id,
                asset_code="CAM-003",
                serial_number="R6-003",
            ),
        ]

        db.add_all(inventory_items)
        db.commit()

        print("Seed data created successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed()