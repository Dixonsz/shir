import re
import unicodedata

from flask import jsonify, request
from flask_jwt_extended import get_jwt, verify_jwt_in_request


WRITE_METHODS = {'POST', 'PUT', 'PATCH', 'DELETE'}

# Endpoints publicos necesarios para login, health y agendamiento publico.
PUBLIC_ENDPOINT_RULES = (
    ('POST', re.compile(r'^/api/login$')),
    ('GET', re.compile(r'^/api/status$')),
    ('GET', re.compile(r'^/health$')),
    ('GET', re.compile(r'^/api/members$')),
    ('GET', re.compile(r'^/api/services(?:/\d+)?$')),
    ('GET', re.compile(r'^/api/gallery(?:/\d+)?$')),
    ('GET', re.compile(r'^/api/marketing/active$')),
    ('GET', re.compile(r'^/api/appointments$')),
    ('POST', re.compile(r'^/api/appointments$')),
    ('GET', re.compile(r'^/api/clients/number_id/[^/]+$')),
    ('POST', re.compile(r'^/api/clients$')),
)


def normalize_role(role_name):
    if not role_name:
        return ''

    normalized = unicodedata.normalize('NFKD', str(role_name))
    normalized = ''.join(ch for ch in normalized if not unicodedata.combining(ch))
    normalized = normalized.strip().lower()

    aliases = {
        'admin': 'administrador',
        'administrador': 'administrador',
        'manager': 'gerente',
        'gerente': 'gerente',
        'recepcionista': 'recepcionista',
        'employee': 'estilista',
        'estilista': 'estilista',
        'marketing': 'marketing',
    }
    return aliases.get(normalized, normalized)


def normalize_roles(role_values):
    if role_values is None:
        return []

    if isinstance(role_values, (list, tuple, set)):
        raw_roles = list(role_values)
    else:
        raw_roles = [role_values]

    normalized = []
    for role in raw_roles:
        normalized_role = normalize_role(role)
        if normalized_role and normalized_role not in normalized:
            normalized.append(normalized_role)

    return normalized


def is_public_endpoint(method, path):
    for rule_method, pattern in PUBLIC_ENDPOINT_RULES:
        if method == rule_method and pattern.match(path):
            return True
    return False


def has_permission(role_values, method, path):
    roles = normalize_roles(role_values)

    if not roles:
        return False

    if 'administrador' in roles:
        return True

    # Roles es un recurso sensible: solo administrador.
    if path.startswith('/api/roles'):
        return False

    if method not in WRITE_METHODS:
        return any(role in {'gerente', 'recepcionista', 'estilista', 'marketing'} for role in roles)

    if path.startswith('/api/members'):
        return 'gerente' in roles

    if path.startswith('/api/clients') or path.startswith('/api/appointments'):
        return any(role in {'gerente', 'recepcionista'} for role in roles)

    if (
        path.startswith('/api/marketing')
        or path.startswith('/api/promotions')
        or path.startswith('/api/gallery')
    ):
        return any(role in {'gerente', 'marketing'} for role in roles)

    return 'gerente' in roles


def register_access_control(app):
    @app.before_request
    def enforce_role_access():
        if request.method == 'OPTIONS':
            return None

        path = request.path or ''
        method = request.method.upper()

        if not path.startswith('/api') and path != '/health':
            return None

        if is_public_endpoint(method, path):
            return None

        try:
            verify_jwt_in_request()
        except Exception:
            return jsonify(success=False, message='Autenticacion requerida'), 401

        claims = get_jwt() or {}
        role_values = claims.get('roles') or claims.get('role')

        if not has_permission(role_values, method, path):
            return jsonify(success=False, message='No tienes permisos para esta accion'), 403

        return None
