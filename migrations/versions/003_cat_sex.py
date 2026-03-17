"""Add sex column to cats table

Revision ID: 003
Revises: 002
Create Date: 2026-03-17
"""
from alembic import op
import sqlalchemy as sa

revision = "003"
down_revision = "002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("cats", sa.Column("sex", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("cats", "sex")
