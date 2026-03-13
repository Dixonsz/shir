from app.models.member import Member
from app import db

class MemberRepository:

    @staticmethod
    def create(member):
        db.session.add(member)
        db.session.commit()
        return member
    
    @staticmethod
    def get_by_id(member_id):
        return Member.query.filter_by(id=member_id, is_active=True).first()
    
    @staticmethod
    def get_all():
        return Member.query.filter_by(is_active=True).all()
    
    @staticmethod
    def update(member):
        db.session.commit()
        return member
    
    @staticmethod
    def delete(member):
        member.is_active = False
        db.session.commit()
    
    @staticmethod
    def hard_delete(member):
        db.session.delete(member)
        db.session.commit()

    @staticmethod
    def get_by_email(email):
        return Member.query.filter_by(email=email, is_active=True).first()

    
