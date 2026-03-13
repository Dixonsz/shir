from app.repositories.gallery_repository import GalleryRepository
from app.models.gallery import Gallery
from app.auth.cloudinary_config import upload_photo, delete_photo
from app.utils.validators import GalleryValidator, FileValidator
from app import db

class GalleryService:

    @staticmethod
    def create_gallery_item(data):
        is_valid, error = GalleryValidator.validate_gallery_data(data, is_upload=False)
        if not is_valid:
            return {
                "success": False,
                "error": error
            }
        
        try:
            description = data.get('description')
            if description == '':
                description = None
            
            order = int(data.get('order', 0))
            
            gallery_item = Gallery(
                title=data['title'].strip(),
                description=description.strip() if description else None,
                image_url=data['image_url'],
                image_public_id=data.get('image_public_id'),
                order=order
            )

            created = GalleryRepository.create(gallery_item)

            return {
                "success": True,
                "data": created.to_dict()
            }
        except KeyError as e:
            return {
                "success": False,
                "error": f"Campo requerido faltante: {str(e)}"
            }
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Error al crear item de galería: {str(e)}"
            }
    
    @staticmethod
    def upload_gallery_image(file, title, description=None, order=0):
        is_valid, error = GalleryValidator.validate_image_file(file)
        if not is_valid:
            return {
                "success": False,
                "error": error
            }
        
        is_valid, error = GalleryValidator.validate_title(title)
        if not is_valid:
            return {
                "success": False,
                "error": error
            }
        
        if description:
            is_valid, error = GalleryValidator.validate_description(description)
            if not is_valid:
                return {
                    "success": False,
                    "error": error
                }
        
        is_valid, error = GalleryValidator.validate_order(order)
        if not is_valid:
            return {
                "success": False,
                "error": error
            }
        
        cloudinary_public_id = None
        
        try:
            result = upload_photo(file, folder='gallery')
            
            if not result.get('success'):
                return {
                    "success": False,
                    "error": result.get('error', 'Error al subir la imagen')
                }
            
            cloudinary_public_id = result['public_id']
            
            gallery_item = Gallery(
                title=title.strip(),
                description=description.strip() if description else None,
                image_url=result['url'],
                image_public_id=cloudinary_public_id,
                order=int(order) if order else 0
            )
            
            created = GalleryRepository.create(gallery_item)
            
            return {
                "success": True,
                "data": created.to_dict()
            }
            
        except Exception as e:
            if cloudinary_public_id:
                try:
                    delete_photo(cloudinary_public_id)
                    print(f"Rollback: Imagen eliminada de Cloudinary - {cloudinary_public_id}")
                except Exception as del_error:
                    print(f"Error en rollback al eliminar imagen: {del_error}")
            
            db.session.rollback()
            
            return {
                "success": False,
                "error": f"Error al crear item de galería: {str(e)}"
            }
    
    @staticmethod
    def get_gallery_by_id(gallery_id):
        gallery = GalleryRepository.get_gallery_by_id(gallery_id)
        if not gallery:
            return {
                "success": False,
                "error": "Item de galería no encontrado."
            }
        return {
            "success": True,
            "data": gallery.to_dict()
        }
    
    @staticmethod
    def get_all_gallery():
        gallery_items = GalleryRepository.get_all_active()
        return {
            "success": True,
            "data": [item.to_dict() for item in gallery_items] if gallery_items else []
        }
    
    @staticmethod
    def get_all_gallery_admin():
        from app.models.gallery import Gallery
        gallery_items = Gallery.query.order_by(Gallery.order.asc()).all()
        return {
            "success": True,
            "data": [item.to_dict() for item in gallery_items] if gallery_items else []
        }
    
    @staticmethod
    def update_gallery(gallery_id, data):
        gallery = GalleryRepository.get_gallery_by_id(gallery_id)
        if not gallery:
            return {
                "success": False,
                "error": "Item de galería no encontrado."
            }
        
        try:
            if 'title' in data:
                is_valid, error = GalleryValidator.validate_title(data['title'])
                if not is_valid:
                    return {"success": False, "error": error}
                gallery.title = data['title'].strip()
            
            if 'description' in data:
                if data['description']:
                    is_valid, error = GalleryValidator.validate_description(data['description'])
                    if not is_valid:
                        return {"success": False, "error": error}
                    gallery.description = data['description'].strip()
                else:
                    gallery.description = None
            
            if 'order' in data:
                is_valid, error = GalleryValidator.validate_order(data['order'])
                if not is_valid:
                    return {"success": False, "error": error}
                gallery.order = int(data['order'])
            
            if 'image_url' in data:
                is_valid, error = GalleryValidator.validate_url(data['image_url'])
                if not is_valid:
                    return {"success": False, "error": error}
                gallery.image_url = data['image_url']
            
            if 'image_public_id' in data:
                gallery.image_public_id = data['image_public_id']
            
            updated = GalleryRepository.update(gallery)
            
            return {
                "success": True,
                "data": updated.to_dict()
            }
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Error al actualizar item: {str(e)}"
            }
    
    @staticmethod
    def update_gallery_image(gallery_id, file):
        is_valid, error = GalleryValidator.validate_image_file(file)
        if not is_valid:
            return {
                "success": False,
                "error": error
            }
        
        gallery = GalleryRepository.get_gallery_by_id(gallery_id)
        if not gallery:
            return {
                "success": False,
                "error": "Item de galería no encontrado."
            }
        
        old_public_id = gallery.image_public_id
        new_public_id = None
        
        try:
            result = upload_photo(file, folder='gallery')
            
            if not result.get('success'):
                return {
                    "success": False,
                    "error": result.get('error', 'Error al subir la nueva imagen')
                }
            
            new_public_id = result['public_id']
            
            gallery.image_url = result['url']
            gallery.image_public_id = new_public_id
            
            updated = GalleryRepository.update(gallery)
            
            if old_public_id:
                try:
                    delete_photo(old_public_id)
                    print(f"Imagen anterior eliminada de Cloudinary: {old_public_id}")
                except Exception as e:
                    print(f"Advertencia: No se pudo eliminar imagen anterior: {e}")
            
            return {
                "success": True,
                "data": updated.to_dict()
            }
            
        except Exception as e:
            if new_public_id:
                try:
                    delete_photo(new_public_id)
                    print(f"Rollback: Nueva imagen eliminada de Cloudinary - {new_public_id}")
                except Exception as del_error:
                    print(f"Error en rollback: {del_error}")
            
            db.session.rollback()
            
            return {
                "success": False,
                "error": f"Error al actualizar imagen: {str(e)}"
            }
    
    @staticmethod
    def reorder_gallery_items(items_order):
        
        if not items_order or not isinstance(items_order, list):
            return {
                "success": False,
                "error": "Debe proporcionar una lista de items"
            }
        
        try:
            updated_count = 0
            
            for item_data in items_order:
                if not isinstance(item_data, dict):
                    continue
                    
                gallery_id = item_data.get('id')
                new_order = item_data.get('order')
                
                if gallery_id is None or new_order is None:
                    continue
                
                is_valid, error = GalleryValidator.validate_order(new_order)
                if not is_valid:
                    return {
                        "success": False,
                        "error": f"Item {gallery_id}: {error}"
                    }
                
                gallery = GalleryRepository.get_gallery_by_id(gallery_id)
                if gallery:
                    gallery.order = int(new_order)
                    updated_count += 1
            
            db.session.commit()
            
            return {
                "success": True,
                "message": f"{updated_count} items reordenados correctamente"
            }
            
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Error al reordenar items: {str(e)}"
            }
    
    @staticmethod
    def toggle_gallery_status(gallery_id):
        gallery = GalleryRepository.get_gallery_by_id_any_status(gallery_id)
        if not gallery:
            return {
                "success": False,
                "error": "Item de galería no encontrado."
            }
        
        try:
            gallery.is_active = not gallery.is_active
            updated = GalleryRepository.update(gallery)
            
            status = "activado" if gallery.is_active else "desactivado"
            return {
                "success": True,
                "data": updated.to_dict(),
                "message": f"Item {status} correctamente."
            }
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "error": f"Error al cambiar estado: {str(e)}"
            }
    
    @staticmethod
    def delete_gallery(gallery_id):
        print(f"Buscando item de galería con ID: {gallery_id}")
        gallery = GalleryRepository.get_gallery_by_id_any_status(gallery_id)
        if not gallery:
            print(f"Item de galería {gallery_id} no encontrado")
            return {
                "success": False,
                "error": "Item de galería no encontrado."
            }
        
        public_id_to_delete = gallery.image_public_id
        print(f"Item encontrado: {gallery.title}, public_id: {public_id_to_delete}")
        
        try:
            if public_id_to_delete:
                try:
                    print(f"Intentando eliminar imagen de Cloudinary: {public_id_to_delete}")
                    result = delete_photo(public_id_to_delete)
                    if result.get('success'):
                        print(f"Imagen eliminada de Cloudinary: {public_id_to_delete}")
                    else:
                        print(f"Advertencia al eliminar de Cloudinary: {result.get('error')}")
                except Exception as e:
                    print(f"Error al eliminar de Cloudinary: {e}")
            
            print(f"Realizando hard delete del item {gallery_id}")
            GalleryRepository.hard_delete(gallery)
            print(f"Hard delete completado para item {gallery_id}")
            
            return {
                "success": True,
                "message": "Item eliminado permanentemente."
            }
            
        except Exception as e:
            print(f"Error crítico al eliminar item {gallery_id}: {str(e)}")
            db.session.rollback()
            return {
                "success": False,
                "error": f"Error al eliminar item: {str(e)}"
            }
