import datetime
from app import db

#Marketing y promociones.
#Este modelo gestiona las campañas de marketing y las promociones asociadas.
# Permite organizar y controlar las estrategias de marketing dentro del sistema.
# Facilita la vinculación de promociones con campañas específicas.

class Marketing(db.Model):
    __tablename__ = 'marketing'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    media_url = db.Column(db.String(255), nullable=True)
    promotion_id = db.Column(db.Integer, db.ForeignKey('promotions.id'), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    start_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    promotion = db.relationship('Promotion', backref=db.backref('marketings', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "media_url": self.media_url,
            "promotion_id": self.promotion_id,
            "is_active": self.is_active,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }