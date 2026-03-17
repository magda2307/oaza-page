"""Add partners table

Revision ID: 010
Revises: 009
Create Date: 2026-03-18
"""
from alembic import op
import sqlalchemy as sa

revision = "010"
down_revision = "009"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "partners",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("initials", sa.Text(), nullable=False),
        sa.Column("color_class", sa.Text(), nullable=False, server_default="bg-stone-100 text-stone-600"),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("event_name", sa.Text(), nullable=False),
        sa.Column(
            "event_type",
            sa.Text(),
            nullable=False,
            comment="One of: aukcja, zbiórka, wolontariat, pro-bono, event",
        ),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("impact", sa.Text(), nullable=True),
        sa.Column("website_url", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )
    op.create_index("ix_partners_year", "partners", ["year"])
    op.create_index("ix_partners_sort", "partners", ["sort_order", "year"])


def downgrade() -> None:
    op.drop_index("ix_partners_sort", "partners")
    op.drop_index("ix_partners_year", "partners")
    op.drop_table("partners")
