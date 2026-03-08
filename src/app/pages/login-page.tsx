import { useLocation } from 'react-router-dom'
import { LoginForm } from '@/app/features/auth/components/login-form'

const LoginPage = () => {
  const location = useLocation()
  const passwordChanged = location.state?.passwordChanged

  return (
    <div className="flex flex-col gap-8">

      <div className="flex flex-col gap-1 text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white font-bold text-lg">
          A
        </div>
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500">Zaloguj się do swojego konta</p>
      </div>

      {passwordChanged && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 text-center">
          Hasło zostało zmienione — możesz się teraz zalogować
        </div>
      )}

      <LoginForm />

    </div>
  )
}

export { LoginPage }