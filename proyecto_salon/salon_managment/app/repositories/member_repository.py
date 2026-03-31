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
    def get_all(page=1, page_size=10, order='desc', order_by='id'):
        query = Member.query.filter_by(is_active=True)

        if order_by == 'id':
            query = query.order_by(Member.id.asc() if order == 'asc' else Member.id.desc())
        elif order_by == 'name':
            query = query.order_by(Member.name.asc() if order == 'asc' else Member.name.desc())

        total = query.count()
        items = query.paginate(page=page, per_page=page_size, error_out=False).items

        return {
            "items": items,
            "total": total,
            "page": page,
            "pages": (total + page_size - 1) // page_size,
            "page_size": page_size
        }

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

    
