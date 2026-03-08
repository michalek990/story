import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { cn } from '@/app/shared/utils/common.utils'
import { authService } from '@/app/services/auth.service'

const setNewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Hasło jest wymagane')
      .min(8, 'Hasło musi mieć minimum 8 znaków')
      .regex(/\d/, 'Hasło musi zawierać co najmniej jedną cyfrę'),
    confirmPassword: z.string().min(1, 'Potwierdzenie hasła jest wymagane'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła nie są identyczne',
    path: ['confirmPassword'],
  })

type SetNewPasswordValues = z.infer<typeof setNewPasswordSchema>

type ApiError = { message: string }

const SetNewPasswordForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const { mutate, isPending, error } = useMutation<
    unknown,
    AxiosError<ApiError>,
    { token: string; password: string }
  >({
    mutationFn: ({ token, password }) =>
      authService.setNewPassword(token, password),
    onSuccess: () => {
      navigate('/login', { state: { passwordChanged: true } })
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetNewPasswordValues>({
    resolver: zodResolver(setNewPasswordSchema),
  })

  const onSubmit = (data: SetNewPasswordValues) =>
    mutate({ token, password: data.password })

  const apiError = error?.response?.data?.message

  // ── brak tokenu w URL ─────────────────────────────────
  if (!token) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
          ✗
        </div>
        <div>
          <p className="font-semibold text-gray-900">Nieprawidłowy link</p>
          <p className="mt-1 text-sm text-gray-500">
            Link do resetu hasła jest nieprawidłowy lub wygasł.
          </p>
        </div>
        <Link
          to="/reset-password"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Wyślij nowy link
        </Link>
      </div>
    )
  }

  // ── formularz ─────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {apiError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {/* nowe hasło */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700" htmlFor="password">
          Nowe hasło
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
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
        <p className="text-xs text-gray-400">
          Minimum 8 znaków, w tym co najmniej jedna cyfra
        </p>
      </div>

      {/* potwierdź hasło */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">
          Potwierdź hasło
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          className={cn(
            'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
            'placeholder:text-gray-400',
            'focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
            errors.confirmPassword
              ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
              : 'border-gray-200 bg-white',
          )}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'mt-1 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
          'bg-gray-900 text-white hover:bg-gray-700',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {isPending ? 'Zapisywanie...' : 'Ustaw nowe hasło'}
      </button>

    </form>
  )
}

export { SetNewPasswordForm }