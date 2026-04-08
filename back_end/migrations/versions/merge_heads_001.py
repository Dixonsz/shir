"""merge migration heads into single linear chain

Revision ID: merge_heads_001
Revises: add_gallery_table_001
Create Date: 2026-04-01 00:00:00.000000

This migration merges the previously divergent branches:
  - Branch 1 (main): 6fee3d62acdf -> 0d824abd8602 -> add_photo_fields_001
                      -> c9a1b2d3e4f5 -> b1f3e7a9c245
  - Branch 2 (gallery): add_gallery_table_001 (now rebased onto b1f3e7a9c245)

The result is a single linear history ending at this revision.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'merge_heads_001'
down_revision = ('add_gallery_table_001',)
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
