import datetime
from app import db
# productos del sistema.
# Cada producto tiene información básica como nombre, categoría, descripción, precio y stock.

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category_product_id = db.Column(db.Integer, db.ForeignKey('category_products.id'), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    category_product = db.relationship('CategoryProduct', backref=db.backref('products', lazy=True))
    
    @property
    def in_stock(self):
        """Verifica si el producto tiene stock disponible"""
        return self.stock > 0

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category_product_id": self.category_product_id,
            "description": self.description,
            "price": self.price,
            "stock": self.stock,
            "in_stock": self.in_stock,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }