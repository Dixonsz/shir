import datetime

from app import db


class MemberRole(db.Model):
    __tablename__ = 'member_roles'

    member_id = db.Column(db.Integer, db.ForeignKey('members.id', ondelete='CASCADE'), primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)
