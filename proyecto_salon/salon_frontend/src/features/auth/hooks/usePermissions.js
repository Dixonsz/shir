import { canReadResource, canWriteResource, normalizeRoles } from '../../../core/auth/permissions';
import { useAuth } from './useAuth';

export function usePermissions() {
  const { user, loading } = useAuth();
  const roles = normalizeRoles(user?.roles?.length ? user.roles : user?.role);

  return {
    role: roles[0] || '',
    roles,
    loading,
    canReadResource: (resource) => canReadResource(roles, resource),
    canWriteResource: (resource) => canWriteResource(roles, resource),
  };
}
