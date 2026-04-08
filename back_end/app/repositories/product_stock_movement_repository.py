from app import db
from app.models.product_stock_movement import ProductStockMovement


class ProductStockMovementRepository:

    @staticmethod
    def create(movement):
        db.session.add(movement)
        db.session.commit()
        return movement

    @staticmethod
    def get_by_product_id(product_id):
        return ProductStockMovement.query.filter_by(product_id=product_id).order_by(
            ProductStockMovement.created_at.desc()
        ).all()