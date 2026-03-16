"""add tags array to cats

Revision ID: 002
Revises: 001
Create Date: 2026-03-17

"""
from typing import Sequence, Union
from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE cats ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}'")


def downgrade() -> None:
    op.execute("ALTER TABLE cats DROP COLUMN IF EXISTS tags")
