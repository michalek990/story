// ── role ─────────────────────────────────────────────────
export type UserRole = 'admin' | 'system_admin' | 'coordinator' | 'user'

// ── uprawnienia ───────────────────────────────────────────
// Definiuje co każda rola może robić w aplikacji
export const ROLE_PERMISSIONS = {
  // zarządzanie użytkownikami
  canViewUsers:         ['admin', 'system_admin', 'coordinator'] as UserRole[],
  canCreateUser:        ['admin', 'system_admin'] as UserRole[],
  canEditUser:          ['admin', 'system_admin'] as UserRole[],
  canDeleteUser:        ['admin', 'system_admin'] as UserRole[],
  canActivateUser:      ['admin', 'system_admin', 'coordinator'] as UserRole[],
  canResetUserPassword: ['admin', 'system_admin'] as UserRole[],

  // nawigacja
  canViewDashboard:     ['admin', 'system_admin', 'coordinator', 'user'] as UserRole[],
} as const

export type Permission = keyof typeof ROLE_PERMISSIONS

// ── helper ────────────────────────────────────────────────
export const hasPermission = (role: UserRole | string, permission: Permission): boolean => {
  const allowed = ROLE_PERMISSIONS[permission] as readonly string[]
  return allowed.includes(role)
}