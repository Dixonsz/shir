from flask import Blueprint, request, jsonify

from app.utils.cloudinary_service import delete_image, upload_image

cloudinary_bp = Blueprint('cloudinary', __name__, url_prefix='/api')

def upload_photo(file, folder='salon_photos'):
    return upload_image(file, folder=folder)

def delete_photo(public_id):
    return delete_image(public_id)

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
        return jsonify(result), 400 if 'No se proporciono' in result.get('error', '') else 500
