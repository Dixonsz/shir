import os
import importlib
from typing import Optional

DEFAULT_ALLOWED_FORMATS = ["jpg", "jpeg", "png", "gif", "webp", "svg"]
SVG_MIME_TYPES = {"image/svg+xml", "image/svg", "image/x-svg+xml", "application/svg+xml"}


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
        filename = getattr(file, "filename", "") or ""
        extension = filename.rsplit(".", 1)[1].lower() if "." in filename else ""
        raw_mime = (getattr(file, "mimetype", None) or getattr(file, "content_type", "") or "").lower()
        mime_type = raw_mime.split(";", 1)[0].strip()
        is_svg = extension == "svg" or mime_type in SVG_MIME_TYPES

        effective_transformation = None
        if not is_svg:
            effective_transformation = transformation or [
                {"width": 1200, "height": 1200, "crop": "limit"},
                {"quality": "auto"},
            ]

        upload_options = {
            "folder": folder,
            "transformation": effective_transformation,
        }

        # Cloudinary puede detectar algunos SVG como formato no estandar (p.ej. xml)
        # y rechazarlo cuando se envía allowed_formats. Para SVG usamos validación local
        # (extension/MIME) y evitamos ese filtro remoto estricto.
        if not is_svg:
            upload_options["allowed_formats"] = allowed_formats or DEFAULT_ALLOWED_FORMATS

        data = cloudinary_uploader.upload(file, **upload_options)
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
