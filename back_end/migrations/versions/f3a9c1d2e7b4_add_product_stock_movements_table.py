"""add product_stock_movements table

Revision ID: f3a9c1d2e7b4
Revises: merge_heads_001
Create Date: 2026-04-08 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f3a9c1d2e7b4'
down_revision = 'merge_heads_001'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'product_stock_movements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('movement_type', sa.String(length=20), nullable=False, server_default='in'),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('stock_before', sa.Integer(), nullable=False),
        sa.Column('stock_after', sa.Integer(), nullable=False),
        sa.Column('purchase_price', sa.Float(), nullable=True),
        sa.Column('notes', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], onupdate='CASCADE', ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_product_stock_movements_product_id', 'product_stock_movements', ['product_id'])
    op.create_index('idx_product_stock_movements_created_at', 'product_stock_movements', ['created_at'])


def downgrade():
    op.drop_index('idx_product_stock_movements_created_at', table_name='product_stock_movements')
    op.drop_index('idx_product_stock_movements_product_id', table_name='product_stock_movements')
    op.drop_table('product_stock_movements')