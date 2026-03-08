import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { cn } from '@/app/shared/utils/common.utils'
import { useLogin } from '@/app/features/auth/hooks/use-login'

// ── schemat walidacji ────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email jest wymagany')
    .email('Podaj poprawny adres email'),
  password: z
    .string()
    .min(1, 'Hasło jest wymagane')
    .min(6, 'Hasło musi mieć minimum 6 znaków'),
})

type LoginFormValues = z.infer<typeof loginSchema>

// ── komponent ────────────────────────────────────────────
const LoginForm = () => {
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data)
  }

  // błąd z API (np. złe hasło, user nie istnieje)
  const apiError = login.error?.response?.data?.message

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {/* błąd z API */}
      {apiError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {/* email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="jan@example.com"
          {...register('email')}
          className={cn(
            'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
            'placeholder:text-gray-400',
            'focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
            errors.email
              ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
              : 'border-gray-200 bg-white',
          )}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* hasło */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700" htmlFor="password">
            Hasło
          </label>
          <Link
            to="/reset-password"
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            Zapomniałeś hasła?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
          className={cn(
            'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
            'placeholder:text-gray-400',
            'focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
            errors.password
              ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
              : 'border-gray-200 bg-white',
          )}
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* przycisk */}
      <button
        type="submit"
        disabled={login.isPending}
        className={cn(
          'mt-1 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
          'bg-gray-900 text-white hover:bg-gray-700',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {login.isPending ? 'Logowanie...' : 'Zaloguj się'}
      </button>

    </form>
  )
}

export { LoginForm }