from app.models.product import Product
from app import db

class ProductRepository:

    @staticmethod
    def create(product):
        db.session.add(product)
        db.session.commit()
        return product
    
    @staticmethod
    def get_product_by_id(product_id):
        return Product.query.filter_by(id=product_id, is_active=True).first()
    
    @staticmethod
    def get_all(page=1, page_size=10, order='desc', order_by='id'):
        query = Product.query.filter_by(is_active=True)

        if order_by == 'id':
            query = query.order_by(Product.id.asc() if order == 'asc' else Product.id.desc())
        elif order_by == 'name':
            query = query.order_by(Product.name.asc() if order == 'asc' else Product.name.desc())

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
    def update(product):
        db.session.commit()
        return product
    
    @staticmethod
    def delete(product):
        product.is_active = False
        db.session.commit()

    @staticmethod
    def get_product_by_name(name):
        return Product.query.filter_by(name=name, is_active=True).first()