import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth-provider'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  // czekaj aż AuthProvider sprawdzi sessionStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export { ProtectedRoute }