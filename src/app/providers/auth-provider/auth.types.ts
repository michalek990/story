export type AuthUser = {
  id: string
  email: string
  name: string
  role: string
}

export type AuthContextType = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: AuthUser, token: string, refreshToken?: string) => void
  clearAuth: () => void
}