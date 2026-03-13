from flask import Blueprint, request, jsonify
import cloudinary.uploader
import cloudinary

cloudinary_bp = Blueprint('cloudinary', __name__, url_prefix='/api')

def upload_photo(file, folder='salon_photos'):
  
    try:
        data = cloudinary.uploader.upload(
            file,
            folder=folder,
            allowed_formats=['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation=[
                {'width': 1200, 'height': 1200, 'crop': 'limit'},
                {'quality': 'auto'}
            ]
        )
        
        return {
            'success': True,
            'url': data['secure_url'],
            'public_id': data['public_id']
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Error al subir imagen: {str(e)}'
        }

def delete_photo(public_id):
    
    if not public_id:
        return {
            'success': False,
            'error': 'No se proporcionó public_id'
        }
    
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {
            'success': True,
            'data': result
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Error al eliminar imagen: {str(e)}'
        }

@cloudinary_bp.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No se encontró archivo'
        }), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'Archivo vacío'
        }), 400
    
    result = upload_photo(file, folder='salon_marketing')
    
    if result['success']:
        return jsonify({
            'success': True,
            'data': {
                'url': result['url'],
                'public_id': result['public_id']
            }
        }), 200
    else:
        return jsonify(result), 500

@cloudinary_bp.route('/delete', methods=['POST'])
def delete_image():
    data = request.json
    public_id = data.get('public_id')

    result = delete_photo(public_id)
    
    if result['success']:
        return jsonify(result), 200
    else:
        return jsonify(result), 400 if 'No se proporcionó' in result.get('error', '') else 500
