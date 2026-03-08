import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/auth-provider'
import { axiosInstance } from '@/app/services/axios.instance'
import { USER_ROLES } from '@/app/features/users/components/user-form'
import { cn } from '@/app/shared/utils/common.utils'

// ── schemat zmiany hasła ──────────────────────────────────
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Obecne hasło jest wymagane'),
    newPassword: z
      .string()
      .min(8, 'Hasło musi mieć minimum 8 znaków')
      .regex(/\d/, 'Hasło musi zawierać co najmniej jedną cyfrę'),
    confirmPassword: z.string().min(1, 'Potwierdzenie jest wymagane'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Hasła nie są identyczne',
    path: ['confirmPassword'],
  })

type ChangePasswordValues = z.infer<typeof changePasswordSchema>

const inputClass = (hasError: boolean) =>
  cn(
    'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
    'focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
    hasError
      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
      : 'border-gray-200 bg-white',
  )

// ── komponent ─────────────────────────────────────────────
const ProfilePage = () => {
  const { user } = useAuth()
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const roleName = USER_ROLES.find((r) => r.value === user?.role)?.label ?? user?.role

  const changePassword = useMutation({
    mutationFn: (data: ChangePasswordValues) =>
      axiosInstance.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success('Hasło zostało zmienione')
      setShowPasswordForm(false)
      reset()
    },
    onError: () => {
      toast.error('Nie udało się zmienić hasła — sprawdź obecne hasło')
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  })

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">

      <h1 className="text-xl font-bold text-gray-900">Mój profil</h1>

      {/* dane konta */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Dane konta
        </h2>

        <div className="flex items-center gap-4 mb-6">
          {/* avatar */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white text-xl font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: 'Imię i nazwisko', value: user?.name },
            { label: 'Email',           value: user?.email },
            { label: 'Rola',            value: roleName },
            { label: 'ID konta',        value: user?.id },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-400">{label}</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{value ?? '—'}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* zmiana hasła */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Zmiana hasła
          </h2>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Zmień hasło
            </button>
          )}
        </div>

        {!showPasswordForm ? (
          <p className="text-sm text-gray-400">
            Ostatnia zmiana hasła: nieznana
          </p>
        ) : (
          <form
            onSubmit={handleSubmit((data) => changePassword.mutate(data))}
            className="flex flex-col gap-4"
          >
            {/* obecne hasło */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Obecne hasło</label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register('currentPassword')}
                className={inputClass(!!errors.currentPassword)}
              />
              {errors.currentPassword && (
                <p className="text-xs text-red-600">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* nowe hasło */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Nowe hasło</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('newPassword')}
                className={inputClass(!!errors.newPassword)}
              />
              {errors.newPassword && (
                <p className="text-xs text-red-600">{errors.newPassword.message}</p>
              )}
            </div>

            {/* potwierdzenie */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Potwierdź nowe hasło</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={inputClass(!!errors.confirmPassword)}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setShowPasswordForm(false); reset() }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                type="submit"
                disabled={changePassword.isPending}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {changePassword.isPending ? 'Zapisywanie...' : 'Zmień hasło'}
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  )
}

export { ProfilePage }