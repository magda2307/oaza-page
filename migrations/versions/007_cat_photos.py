"""Add cat_photos table

Revision ID: 007
Revises: 006
Create Date: 2026-03-17
"""
from alembic import op
import sqlalchemy as sa

revision = "007"
down_revision = "006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "cat_photos",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("cat_id", sa.Integer(), sa.ForeignKey("cats.id", ondelete="CASCADE"), nullable=False),
        sa.Column("url", sa.Text(), nullable=False),
        sa.Column("r2_key", sa.Text(), nullable=True),
        sa.Column("display_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_primary", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_cat_photos_cat_id", "cat_photos", ["cat_id"])


def downgrade() -> None:
    op.drop_index("ix_cat_photos_cat_id", "cat_photos")
    op.drop_table("cat_photos")
