import datetime
from app import db


class ProductStockMovement(db.Model):
    __tablename__ = 'product_stock_movements'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    movement_type = db.Column(db.String(20), nullable=False, default='in')
    quantity = db.Column(db.Integer, nullable=False)
    stock_before = db.Column(db.Integer, nullable=False)
    stock_after = db.Column(db.Integer, nullable=False)
    purchase_price = db.Column(db.Float, nullable=True)
    notes = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    product = db.relationship('Product', backref=db.backref('stock_movements', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'movement_type': self.movement_type,
            'quantity': self.quantity,
            'stock_before': self.stock_before,
            'stock_after': self.stock_after,
            'purchase_price': self.purchase_price,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }