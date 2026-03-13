from app.services.gallery_service import GalleryService
from flask import Blueprint, request, jsonify

gallery_bp = Blueprint('gallery_bp', __name__, url_prefix='/api')

@gallery_bp.route('/gallery', methods=['POST'])
def create_gallery_item():
    data = request.json
    
    if not data:
        return jsonify(
            success=False,
            message="No se proporcionaron datos"
        ), 400
    
    if 'title' not in data or not data['title'].strip():
        return jsonify(
            success=False,
            message="El título es requerido"
        ), 400
    
    if 'image_url' not in data or not data['image_url'].strip():
        return jsonify(
            success=False,
            message="La URL de la imagen es requerida"
        ), 400
    
    result = GalleryService.create_gallery_item(data)

    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400

    return jsonify(
        success=True,
        data=result["data"]
    ), 201

@gallery_bp.route('/gallery/upload', methods=['POST'])
def upload_gallery_image():
    if 'image' not in request.files:
        return jsonify(
            success=False,
            message="No se encontró el archivo de imagen"
        ), 400
    
    file = request.files['image']
    
    if not file or file.filename == '':
        return jsonify(
            success=False,
            message="Archivo vacío o no válido"
        ), 400
    
    title = request.form.get('title', '').strip()
    if not title:
        return jsonify(
            success=False,
            message="El título es requerido"
        ), 400
    
    description = request.form.get('description', '').strip()
    description = description if description else None
    
    order = request.form.get('order', 0)
    
    result = GalleryService.upload_gallery_image(file, title, description, order)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 201

@gallery_bp.route('/gallery/<int:gallery_id>', methods=['GET'])
def get_gallery_item(gallery_id):
    result = GalleryService.get_gallery_by_id(gallery_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@gallery_bp.route('/gallery', methods=['GET'])
def get_all_gallery():
    result = GalleryService.get_all_gallery()
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@gallery_bp.route('/gallery/admin', methods=['GET'])
def get_all_gallery_admin():
    result = GalleryService.get_all_gallery_admin()
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@gallery_bp.route('/gallery/<int:gallery_id>', methods=['PUT'])
def update_gallery_item(gallery_id):
    result = GalleryService.update_gallery(gallery_id, request.json)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@gallery_bp.route('/gallery/<int:gallery_id>/image', methods=['PUT'])
def update_gallery_image(gallery_id):
    if 'image' not in request.files:
        return jsonify(
            success=False,
            message="No se encontró el archivo de imagen"
        ), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify(
            success=False,
            message="Archivo vacío"
        ), 400
    
    result = GalleryService.update_gallery_image(gallery_id, file)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404 if "no encontrado" in result["error"] else 400
    
    return jsonify(
        success=True,
        data=result["data"]
    ), 200

@gallery_bp.route('/gallery/reorder', methods=['PUT'])
def reorder_gallery_items():
    
    data = request.json
    items_order = data.get('items', [])
    
    if not items_order:
        return jsonify(
            success=False,
            message="No se proporcionaron items para reordenar"
        ), 400
    
    result = GalleryService.reorder_gallery_items(items_order)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 400
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200

@gallery_bp.route('/gallery/<int:gallery_id>/toggle', methods=['PATCH'])
def toggle_gallery_status(gallery_id):
    result = GalleryService.toggle_gallery_status(gallery_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        data=result["data"],
        message=result["message"]
    ), 200

@gallery_bp.route('/gallery/<int:gallery_id>', methods=['DELETE'])
def delete_gallery_item(gallery_id):
    result = GalleryService.delete_gallery(gallery_id)
    
    if not result["success"]:
        return jsonify(
            success=False,
            message=result["error"]
        ), 404
    
    return jsonify(
        success=True,
        message=result["message"]
    ), 200
