"""add late fee payment type

Revision ID: 34a1e256b839
Revises: 2f27fff810c2
Create Date: 2026-08-16 02:32:05.152275

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "34a1e256b839"
down_revision: Union[str, Sequence[str], None] = "2f27fff810c2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TYPE paymenttype ADD VALUE IF NOT EXISTS 'LATE_FEE'"
    )


def downgrade() -> None:
    pass