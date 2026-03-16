const ROLE_ALIASES = {
  admin: 'administrador',
  administrador: 'administrador',
  manager: 'gerente',
  gerente: 'gerente',
  recepcionista: 'recepcionista',
  employee: 'estilista',
  estilista: 'estilista',
  marketing: 'marketing',
};

const READ_ROLES = new Set(['administrador', 'gerente', 'recepcionista', 'estilista', 'marketing']);

const WRITE_ROLES_BY_RESOURCE = {
  roles: new Set(['administrador']),
  members: new Set(['administrador', 'gerente']),
  clients: new Set(['administrador', 'gerente', 'recepcionista']),
  appointments: new Set(['administrador', 'gerente', 'recepcionista']),
  marketing: new Set(['administrador', 'gerente', 'marketing']),
  promotions: new Set(['administrador', 'gerente', 'marketing']),
  gallery: new Set(['administrador', 'gerente', 'marketing']),
  products: new Set(['administrador', 'gerente']),
  services: new Set(['administrador', 'gerente']),
  category_products: new Set(['administrador', 'gerente']),
  category_services: new Set(['administrador', 'gerente']),
  additionals: new Set(['administrador', 'gerente']),
  dashboard: new Set(['administrador', 'gerente', 'recepcionista', 'estilista', 'marketing']),
  settings: new Set(['administrador', 'gerente', 'recepcionista', 'estilista', 'marketing']),
};

export function normalizeRole(roleName) {
  if (!roleName) return '';
  const normalized = String(roleName).trim().toLowerCase();
  return ROLE_ALIASES[normalized] || normalized;
}

export function normalizeRoles(roleValues) {
  const values = Array.isArray(roleValues) ? roleValues : [roleValues];
  const normalized = values
    .map((value) => normalizeRole(value))
    .filter(Boolean);

  return [...new Set(normalized)];
}

export function canReadResource(roleValues, resource) {
  const roles = normalizeRoles(roleValues);
  if (roles.length === 0) return false;
  if (!roles.some((role) => READ_ROLES.has(role))) return false;

  if (resource === 'roles') {
    return roles.includes('administrador');
  }

  return true;
}

export function canWriteResource(roleValues, resource) {
  const roles = normalizeRoles(roleValues);
  const allowedRoles = WRITE_ROLES_BY_RESOURCE[resource];
  if (!allowedRoles) return false;
  return roles.some((role) => allowedRoles.has(role));
}
