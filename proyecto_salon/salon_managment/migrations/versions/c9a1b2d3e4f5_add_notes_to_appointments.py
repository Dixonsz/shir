"""add notes field to appointments

Revision ID: c9a1b2d3e4f5
Revises: add_photo_fields_001
Create Date: 2026-03-15 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c9a1b2d3e4f5'
down_revision = 'add_photo_fields_001'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('appointments', sa.Column('notes', sa.Text(), nullable=True))


def downgrade():
    op.drop_column('appointments', 'notes')
