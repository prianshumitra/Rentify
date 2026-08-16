"""add user authentication fields

Revision ID: 6d3646e92c89
Revises: 34a1e256b839
Create Date: 2026-08-16 12:50:42.836490

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6d3646e92c89"
down_revision: Union[str, Sequence[str], None] = "34a1e256b839"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add the new columns temporarily as nullable.
    op.add_column(
        "users",
        sa.Column(
            "hashed_password",
            sa.String(length=255),
            nullable=True,
        ),
    )

    op.add_column(
        "users",
        sa.Column(
            "is_admin",
            sa.Boolean(),
            nullable=True,
        ),
    )

    # Migrate the existing password hash.
    op.execute(
        """
        UPDATE users
        SET hashed_password = password_hash
        """
    )

    # Convert the existing role into the new admin flag.
    op.execute(
        """
        UPDATE users
        SET is_admin = CASE
            WHEN role = 'admin' THEN TRUE
            ELSE FALSE
        END
        """
    )

    # Both columns now contain values for all existing users.
    op.alter_column(
        "users",
        "hashed_password",
        nullable=False,
    )

    op.alter_column(
        "users",
        "is_admin",
        nullable=False,
    )

    # Remove the old authentication/authorization columns.
    op.drop_column("users", "password_hash")
    op.drop_column("users", "role")


def downgrade() -> None:
    # Restore the old columns.
    op.add_column(
        "users",
        sa.Column(
            "password_hash",
            sa.String(length=255),
            nullable=True,
        ),
    )

    op.add_column(
        "users",
        sa.Column(
            "role",
            sa.String(length=50),
            nullable=True,
        ),
    )

    # Copy the new values back.
    op.execute(
        """
        UPDATE users
        SET password_hash = hashed_password
        """
    )

    op.execute(
        """
        UPDATE users
        SET role = CASE
            WHEN is_admin = TRUE THEN 'admin'
            ELSE 'customer'
        END
        """
    )

    op.alter_column(
        "users",
        "password_hash",
        nullable=False,
    )

    op.alter_column(
        "users",
        "role",
        nullable=False,
    )

    op.drop_column("users", "hashed_password")
    op.drop_column("users", "is_admin")