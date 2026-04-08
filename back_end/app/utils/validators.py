
import re
from werkzeug.datastructures import FileStorage

class GalleryValidator:
    
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'}
    ALLOWED_MIME_TYPES = {
        'image/jpeg', 'image/jpg', 'image/pjpeg',
        'image/png', 'image/gif', 'image/webp',
        'image/svg+xml', 'image/svg', 'image/x-svg+xml', 'application/svg+xml'
    }
    SVG_MIME_ALIASES = {'image/svg', 'image/x-svg+xml', 'application/svg+xml'}
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB en bytes
    MAX_TITLE_LENGTH = 100
    MAX_DESCRIPTION_LENGTH = 255
    MAX_ORDER_VALUE = 9999
    
    @staticmethod
    def validate_image_file(file):

        if not file:
            return False, "No se proporcionó archivo"
        
        if not isinstance(file, FileStorage):
            return False, "Tipo de archivo inválido"
        
        if file.filename == '':
            return False, "Nombre de archivo vacío"
        
        extension = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if extension not in GalleryValidator.ALLOWED_EXTENSIONS:
            return False, f"Extensión no permitida. Permitidas: {', '.join(GalleryValidator.ALLOWED_EXTENSIONS)}"
        
        raw_mime = (getattr(file, 'mimetype', None) or getattr(file, 'content_type', '') or '').strip().lower()
        mime_type = raw_mime.split(';', 1)[0]

      
        if mime_type:
            is_allowed_mime = mime_type in GalleryValidator.ALLOWED_MIME_TYPES
            is_svg_alias = extension == 'svg' and mime_type in GalleryValidator.SVG_MIME_ALIASES
            if not is_allowed_mime and not is_svg_alias:
                return False, "Tipo de archivo no permitido. Debe ser una imagen válida"
        
        file.seek(0, 2) 
        size = file.tell()
        file.seek(0)
        
        if size > GalleryValidator.MAX_FILE_SIZE:
            max_mb = GalleryValidator.MAX_FILE_SIZE / (1024 * 1024)
            return False, f"Archivo muy grande. Máximo: {max_mb}MB"
        
        if size == 0:
            return False, "Archivo vacío"
        
        return True, ""
    
    @staticmethod
    def validate_title(title):
      

        if not title or not title.strip():
            return False, "El título es requerido"
        
        if len(title) > GalleryValidator.MAX_TITLE_LENGTH:
            return False, f"Título muy largo. Máximo: {GalleryValidator.MAX_TITLE_LENGTH} caracteres"
        
        return True, ""
    
    @staticmethod
    def validate_description(description):
       
        if description and len(description) > GalleryValidator.MAX_DESCRIPTION_LENGTH:
            return False, f"Descripción muy larga. Máximo: {GalleryValidator.MAX_DESCRIPTION_LENGTH} caracteres"
        
        return True, ""
    
    @staticmethod
    def validate_order(order):
       
        try:
            order_int = int(order)
            if order_int < 0:
                return False, "El orden no puede ser negativo"
            if order_int > GalleryValidator.MAX_ORDER_VALUE:
                return False, f"Orden muy alto. Máximo: {GalleryValidator.MAX_ORDER_VALUE}"
            return True, ""
        except (ValueError, TypeError):
            return False, "El orden debe ser un número válido"
    
    @staticmethod
    def validate_url(url):
       
        if not url or not url.strip():
            return False, "La URL es requerida"
        
        url_pattern = re.compile(
            r'^https?://'  # http:// o https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # dominio
            r'localhost|'  # localhost
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # o IP
            r'(?::\d+)?'  # puerto opcional
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        if not url_pattern.match(url):
            return False, "URL inválida"
        
        return True, ""
    
    @staticmethod
    def validate_gallery_data(data, is_upload=False):
        
        title = data.get('title')
        is_valid, error = GalleryValidator.validate_title(title)
        if not is_valid:
            return False, error
        
        # Validar descripción si existe
        description = data.get('description')
        if description:
            is_valid, error = GalleryValidator.validate_description(description)
            if not is_valid:
                return False, error
        
        order = data.get('order', 0)
        is_valid, error = GalleryValidator.validate_order(order)
        if not is_valid:
            return False, error
        
        if not is_upload:
            image_url = data.get('image_url')
            is_valid, error = GalleryValidator.validate_url(image_url)
            if not is_valid:
                return False, error
        
        return True, ""


class FileValidator:
    
    @staticmethod
    def sanitize_filename(filename):
        if not filename:
            return ""
        
        filename = filename.split('/')[-1].split('\\')[-1]
        
        filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
        
        if len(filename) > 100:
            name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
            filename = name[:90] + '.' + ext if ext else name[:100]
        
        return filename
