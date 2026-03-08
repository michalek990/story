import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { cn } from '@/app/shared/utils/common.utils'
import { authService } from '@/app/services/auth.service'

const resetSchema = z.object({
  email: z
    .string()
    .min(1, 'Email jest wymagany')
    .email('Podaj poprawny adres email'),
})

type ResetFormValues = z.infer<typeof resetSchema>

type ApiError = { message: string }

const ResetPasswordForm = () => {
  const [sent, setSent] = useState(false)

  const { mutate, isPending, error } = useMutation<
    unknown,
    AxiosError<ApiError>,
    string
  >({
    mutationFn: (email) => authService.resetPassword(email),
    onSuccess: () => setSent(true),
  })

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = (data: ResetFormValues) => mutate(data.email)

  const apiError = error?.response?.data?.message

  // ── widok po wysłaniu ─────────────────────────────────
  if (sent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
          ✓
        </div>
        <div>
          <p className="font-semibold text-gray-900">Sprawdź skrzynkę email</p>
          <p className="mt-1 text-sm text-gray-500">
            Wysłaliśmy link do resetu hasła na adres{' '}
            <span className="font-medium text-gray-700">{getValues('email')}</span>
          </p>
        </div>
        <Link
          to="/login"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Wróć do logowania
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

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'mt-1 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
          'bg-gray-900 text-white hover:bg-gray-700',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {isPending ? 'Wysyłanie...' : 'Wyślij link resetujący'}
      </button>

      <Link
        to="/login"
        className="text-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        ← Wróć do logowania
      </Link>

    </form>
  )
}

export { ResetPasswordForm }