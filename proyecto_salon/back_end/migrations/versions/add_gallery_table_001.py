"""add gallery table

Revision ID: add_gallery_table_001
Revises: add_photo_fields_001
Create Date: 2026-02-08 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_gallery_table_001'
down_revision = 'add_photo_fields_001'  # ID de la última migración
branch_labels = None
depends_on = None


def upgrade():
    # Crear tabla gallery
    op.create_table(
        'gallery',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=100), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=False),
        sa.Column('image_public_id', sa.String(length=255), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True, default=0),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    # Eliminar tabla gallery
    op.drop_table('gallery')
