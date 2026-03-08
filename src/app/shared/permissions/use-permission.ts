import { useAuth } from '@/app/providers/auth-provider'
import { hasPermission, Permission } from './permissions'

const usePermission = (permission: Permission): boolean => {
  const { user } = useAuth()
  if (!user?.role) return false
  return hasPermission(user.role, permission)
}

// sprawdź wiele uprawnień naraz
const usePermissions = (permissions: Permission[]): Record<Permission, boolean> => {
  const { user } = useAuth()
  return Object.fromEntries(
    permissions.map((p) => [p, user?.role ? hasPermission(user.role, p) : false]),
  ) as Record<Permission, boolean>
}

export { usePermission, usePermissions }