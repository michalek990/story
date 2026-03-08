import { useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthContext } from './auth.context'
import { AuthUser } from './auth.types'
import { authService } from '@/app/services/auth.service'
import { getToken, setTokens, clearTokens } from '@/app/services/axios.instance'
import { SessionTimeoutWarning } from '@/app/shared/components/session-timeout-warning'

// ╔══════════════════════════════════════════════════════╗
// ║  DEV MODE — zmień na false gdy backend jest gotowy   ║
// ╚══════════════════════════════════════════════════════╝
const DEV_BYPASS_AUTH = true

const DEV_USER: AuthUser = {
  id: 'dev-1',
  email: 'dev@example.com',
  name: 'Dev User',
  role: 'admin',
}

type AuthProviderProps = {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser]           = useState<AuthUser | null>(null)
  const [token, setToken]         = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (DEV_BYPASS_AUTH) {
      setUser(DEV_USER)
      setToken('dev-token')
      setIsLoading(false)
      return
    }

    const savedToken = getToken()
    if (!savedToken) { setIsLoading(false); return }

    authService.me()
      .then((res) => { setToken(savedToken); setUser(res.data) })
      .catch(() => clearTokens())
      .finally(() => setIsLoading(false))
  }, [])

  const setAuth = (authUser: AuthUser, authToken: string, refreshToken?: string) => {
    setTokens(authToken, refreshToken ?? '')
    setToken(authToken)
    setUser(authUser)
  }

  const clearAuth = () => {
    clearTokens()
    setToken(null)
    setUser(null)
  }

  // ── timeout sesji ─────────────────────────────────────
  const handleTimeout = () => {
    clearAuth()
    toast.error('Sesja wygasła z powodu braku aktywności')
  }

  const handleExtend = () => {
    // opcjonalnie: odśwież token przy przedłużeniu sesji
    toast.success('Sesja została przedłużona')
  }

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        setAuth,
        clearAuth,
      }}
    >
      {children}

      {/* ostrzeżenie o wygaśnięciu sesji */}
      <SessionTimeoutWarning
        enabled={isAuthenticated && !DEV_BYPASS_AUTH}
        onTimeout={handleTimeout}
        onExtend={handleExtend}
        onLogout={clearAuth}
      />
    </AuthContext.Provider>
  )
}

export { AuthProvider }