"""add vendor ownership

Revision ID: df90aec31c76
Revises: 6d3646e92c89
Create Date: 2026-08-16 21:38:11.508867

"""

from typing import Sequence, Union
from uuid import UUID

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.

revision: str = "df90aec31c76"
down_revision: Union[str, Sequence[str], None] = "6d3646e92c89"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Add vendor capability to existing users.
    op.add_column(
        "users",
        sa.Column(
            "is_vendor",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )

    # Add vendor ownership to existing products temporarily as nullable.
    op.add_column(
        "products",
        sa.Column(
            "vendor_id",
            sa.Uuid(),
            nullable=True,
        ),
    )

    # Get an existing user to own the existing product.
    connection = op.get_bind()

    user = connection.execute(
        sa.text(
            """
            SELECT id
            FROM users
            ORDER BY created_at
            LIMIT 1
            """
        )
    ).fetchone()

    if user is None:
        raise RuntimeError(
            "No users exist. Cannot assign existing products to a vendor."
        )

    vendor_id = user[0]

    # Give this existing user vendor capability.
    connection.execute(
        sa.text(
            """
            UPDATE users
            SET is_vendor = TRUE
            WHERE id = :vendor_id
            """
        ),
        {"vendor_id": vendor_id},
    )

    # Assign all existing products to that vendor.
    connection.execute(
        sa.text(
            """
            UPDATE products
            SET vendor_id = :vendor_id
            WHERE vendor_id IS NULL
            """
        ),
        {"vendor_id": vendor_id},
    )

    # Now that every existing product has an owner,
    # make vendor_id mandatory.
    op.alter_column(
        "products",
        "vendor_id",
        nullable=False,
    )

    # Add the foreign key and index.
    op.create_foreign_key(
        "fk_products_vendor_id_users",
        "products",
        "users",
        ["vendor_id"],
        ["id"],
    )

    op.create_index(
        "ix_products_vendor_id",
        "products",
        ["vendor_id"],
        unique=False,
    )

    # Remove the temporary server default.
    op.alter_column(
        "users",
        "is_vendor",
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        "ix_products_vendor_id",
        table_name="products",
    )

    op.drop_constraint(
        "fk_products_vendor_id_users",
        "products",
        type_="foreignkey",
    )

    op.drop_column(
        "products",
        "vendor_id",
    )

    op.drop_column(
        "users",
        "is_vendor",
    )