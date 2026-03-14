import os
import importlib
from typing import Optional

DEFAULT_ALLOWED_FORMATS = ["jpg", "jpeg", "png", "gif", "webp"]


def is_cloudinary_enabled() -> bool:
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    return bool(cloud_name and cloud_name != "root")


def upload_image(file, folder: str, transformation=None, allowed_formats=None):
    if not is_cloudinary_enabled():
        return {
            "success": False,
            "error": "Cloudinary no configurado",
        }

    try:
        cloudinary_uploader = importlib.import_module("cloudinary.uploader")

        data = cloudinary_uploader.upload(
            file,
            folder=folder,
            allowed_formats=allowed_formats or DEFAULT_ALLOWED_FORMATS,
            transformation=transformation
            or [
                {"width": 1200, "height": 1200, "crop": "limit"},
                {"quality": "auto"},
            ],
        )
        return {
            "success": True,
            "url": data.get("secure_url"),
            "public_id": data.get("public_id"),
            "raw": data,
        }
    except Exception as exc:
        return {
            "success": False,
            "error": f"Error al subir imagen: {exc}",
        }


def delete_image(public_id: Optional[str]):
    if not public_id:
        return {
            "success": False,
            "error": "No se proporciono public_id",
        }

    try:
        cloudinary_uploader = importlib.import_module("cloudinary.uploader")

        result = cloudinary_uploader.destroy(public_id)
        return {
            "success": True,
            "data": result,
        }
    except Exception as exc:
        return {
            "success": False,
            "error": f"Error al eliminar imagen: {exc}",
        }
