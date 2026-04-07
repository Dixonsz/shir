"""add_photo_fields_to_members_and_clients

Revision ID: add_photo_fields_001
Revises: 
Create Date: 2026-02-08 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_photo_fields_001'
down_revision = '0d824abd8602'  # ID de la última migración
branch_labels = None
depends_on = None


def upgrade():
    # Agregar columnas photo_url y photo_public_id a la tabla members
    op.add_column('members', sa.Column('photo_url', sa.String(length=500), nullable=True))
    op.add_column('members', sa.Column('photo_public_id', sa.String(length=255), nullable=True))
    
    # Agregar columnas photo_url y photo_public_id a la tabla clients
    op.add_column('clients', sa.Column('photo_url', sa.String(length=500), nullable=True))
    op.add_column('clients', sa.Column('photo_public_id', sa.String(length=255), nullable=True))


def downgrade():
    # Eliminar columnas de la tabla clients
    op.drop_column('clients', 'photo_public_id')
    op.drop_column('clients', 'photo_url')
    
    # Eliminar columnas de la tabla members
    op.drop_column('members', 'photo_public_id')
    op.drop_column('members', 'photo_url')
