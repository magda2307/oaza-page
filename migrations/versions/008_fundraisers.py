"""Add fundraisers table

Revision ID: 008
Revises: 007
Create Date: 2026-03-17
"""
from alembic import op
import sqlalchemy as sa

revision = "008"
down_revision = "007"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "fundraisers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("cat_id", sa.Integer(), sa.ForeignKey("cats.id", ondelete="SET NULL"), nullable=True),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("goal_amount", sa.Numeric(10, 2), nullable=True),
        sa.Column("raised_amount", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("closed_at", sa.TIMESTAMP(timezone=True), nullable=True),
    )
    op.create_index("ix_fundraisers_cat_id", "fundraisers", ["cat_id"])


def downgrade() -> None:
    op.drop_index("ix_fundraisers_cat_id", "fundraisers")
    op.drop_table("fundraisers")
