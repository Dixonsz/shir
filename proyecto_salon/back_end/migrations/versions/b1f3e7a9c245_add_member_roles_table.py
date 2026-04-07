"""add member_roles table for multi-role members

Revision ID: b1f3e7a9c245
Revises: c9a1b2d3e4f5
Create Date: 2026-03-15 12:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b1f3e7a9c245'
down_revision = 'c9a1b2d3e4f5'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'member_roles',
        sa.Column('member_id', sa.Integer(), nullable=False),
        sa.Column('role_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['member_id'], ['members.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('member_id', 'role_id'),
    )
    op.create_index('idx_member_roles_role_id', 'member_roles', ['role_id'])


def downgrade():
    op.drop_index('idx_member_roles_role_id', table_name='member_roles')
    op.drop_table('member_roles')
