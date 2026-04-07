from app.models.category_product import CategoryProduct
from app import db

class CategoryProductRepository:

    @staticmethod
    def create(category_product):
        db.session.add(category_product)
        db.session.commit()
        return category_product
    
    @staticmethod
    def get_by_id(category_product_id):
        return CategoryProduct.query.filter_by(id=category_product_id, is_active=True).first()
    
    @staticmethod
    def get_all(page=1, page_size=10, order='desc', order_by='id'):
        query = CategoryProduct.query.filter_by(is_active=True)

        if order_by == 'id':
            query = query.order_by(CategoryProduct.id.asc() if order == 'asc' else CategoryProduct.id.desc())
        elif order_by == 'name':
            query = query.order_by(CategoryProduct.name.asc() if order == 'asc' else CategoryProduct.name.desc())

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
    def update(category_product):
        db.session.commit()
        return category_product
    
    @staticmethod
    def delete(category_product):
        category_product.is_active = False
        db.session.commit()
    
    @staticmethod
    def get_by_name(name):
        return CategoryProduct.query.filter_by(name=name, is_active=True).first()
