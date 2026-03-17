"""Add success_stories table

Revision ID: 006
Revises: 005
Create Date: 2026-03-17
"""
from alembic import op
import sqlalchemy as sa

revision = "006"
down_revision = "005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "success_stories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("cat_name", sa.Text(), nullable=False),
        sa.Column("adopter_name", sa.Text(), nullable=True),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("story", sa.Text(), nullable=False),
        sa.Column("photo_url", sa.Text(), nullable=True),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("published_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("success_stories")
