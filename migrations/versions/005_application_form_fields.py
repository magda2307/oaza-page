"""Add adoption questionnaire fields to applications

Revision ID: 005
Revises: 004
Create Date: 2026-03-17
"""
from alembic import op
import sqlalchemy as sa

revision = "005"
down_revision = "004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("applications", sa.Column("housing_type", sa.Text(), nullable=True))
    op.add_column("applications", sa.Column("has_outdoor_access", sa.Boolean(), nullable=True))
    op.add_column("applications", sa.Column("owns_property", sa.Boolean(), nullable=True))
    op.add_column("applications", sa.Column("adults_count", sa.Integer(), nullable=True))
    op.add_column("applications", sa.Column("children_ages", sa.Text(), nullable=True))
    op.add_column("applications", sa.Column("other_pets", sa.Text(), nullable=True))
    op.add_column("applications", sa.Column("all_household_agree", sa.Boolean(), nullable=True))
    op.add_column("applications", sa.Column("had_cats_before", sa.Boolean(), nullable=True))
    op.add_column("applications", sa.Column("previous_cats_fate", sa.Text(), nullable=True))
    op.add_column("applications", sa.Column("has_vet", sa.Boolean(), nullable=True))
    op.add_column("applications", sa.Column("hours_alone_per_day", sa.Integer(), nullable=True))
    op.add_column("applications", sa.Column("is_indoor_only", sa.Boolean(), nullable=True))
    op.add_column("applications", sa.Column("motivation", sa.Text(), nullable=True))
    op.add_column("applications", sa.Column("home_visit_agreement", sa.Boolean(), nullable=True))


def downgrade() -> None:
    for col in [
        "home_visit_agreement", "motivation", "is_indoor_only", "hours_alone_per_day",
        "has_vet", "previous_cats_fate", "had_cats_before", "all_household_agree",
        "other_pets", "children_ages", "adults_count", "owns_property",
        "has_outdoor_access", "housing_type",
    ]:
        op.drop_column("applications", col)
