import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { usePermission } from './use-permission'
import { Permission } from './permissions'

type RoleGuardProps = {
  permission: Permission
  children: ReactNode
  // tryb "route" — przekieruj na /unauthorized
  // tryb "ui" — po prostu ukryj element (default)
  mode?: 'route' | 'ui'
  fallback?: ReactNode
}

const RoleGuard = ({
  permission,
  children,
  mode = 'ui',
  fallback = null,
}: RoleGuardProps) => {
  const allowed = usePermission(permission)

  if (!allowed) {
    if (mode === 'route') return <Navigate to="/unauthorized" replace />
    return <>{fallback}</>
  }

  return <>{children}</>
}

export { RoleGuard }