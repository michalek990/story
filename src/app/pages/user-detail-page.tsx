import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '@/app/features/users/hooks/use-user'
import { useActivateUser } from '@/app/features/users/hooks/use-activate-user'
import { useDeleteUser } from '@/app/features/users/hooks/use-delete-user'
import { useResetUserPassword } from '@/app/features/users/hooks/use-reset-user-password'
import { USER_ROLES } from '@/app/features/users/components/user-form'
import { cn } from '@/app/shared/utils/common.utils'
import { useState } from 'react'

const UserDetailPage = () => {
  const { id }    = useParams<{ id: string }>()
  const navigate  = useNavigate()
  const [confirmDelete, setConfirmDelete]   = useState(false)
  const [confirmReset,  setConfirmReset]    = useState(false)

  const { data: user, isLoading, isError } = useUser(id!)
  const activateUser   = useActivateUser(id!)
  const deleteUser     = useDeleteUser()
  const resetPassword  = useResetUserPassword()

  const roleName = USER_ROLES.find((r) => r.value === user?.role)?.label ?? user?.role

  // ── ładowanie ─────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl flex flex-col gap-6">
        <div className="h-8 w-56 rounded bg-gray-100 animate-pulse" />
        <div className="rounded-xl border border-gray-200 bg-white p-6 grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // ── błąd ──────────────────────────────────────────────
  if (isError || !user) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
        <p className="text-sm font-medium text-red-700">Nie znaleziono użytkownika</p>
        <button onClick={() => navigate('/users')} className="mt-3 text-sm text-red-500 underline">
          Wróć do listy
        </button>
      </div>
    )
  }

  const isActive = user.status === 'active'

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6">

      {/* breadcrumb + akcje */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/users')}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Użytkownicy
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>
          <span className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
            isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500',
          )}>
            <span className={cn('h-1.5 w-1.5 rounded-full', isActive ? 'bg-green-500' : 'bg-gray-400')} />
            {isActive ? 'Aktywny' : 'Nieaktywny'}
          </span>
        </div>

        {/* przyciski akcji */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/users/${id}/edit`)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edytuj
          </button>
          <button
            onClick={() => activateUser.mutate(user.status)}
            disabled={activateUser.isPending}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isActive ? 'Dezaktywuj' : 'Aktywuj'}
          </button>
          <button
            onClick={() => setConfirmReset(true)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Resetuj hasło
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Usuń
          </button>
        </div>
      </div>

      {/* dane użytkownika */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Dane użytkownika
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: 'Imię',        value: user.firstName },
            { label: 'Nazwisko',    value: user.lastName },
            { label: 'Email',       value: user.email },
            { label: 'Rola',        value: roleName },
            { label: 'Instytucja',  value: user.institutionName },
            { label: 'Zakład',      value: user.facilityName },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-400">{label}</dt>
              <dd className="mt-0.5 text-sm text-gray-900">{value ?? '—'}</dd>
            </div>
          ))}
        </div>
      </div>

      {/* historia zmian — placeholder */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Historia aktywności
        </h2>
        <p className="text-sm text-gray-400">
          Historia aktywności będzie dostępna po podłączeniu backendu.
        </p>
      </div>

      {/* dialog — usuń */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="font-semibold text-gray-900">Usuń użytkownika</h3>
            <p className="mt-2 text-sm text-gray-500">
              Czy na pewno chcesz usunąć użytkownika {user.firstName} {user.lastName}? Tej operacji nie można cofnąć.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  deleteUser.mutate(user.id, { onSuccess: () => navigate('/users') })
                  setConfirmDelete(false)
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}

      {/* dialog — reset hasła */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="font-semibold text-gray-900">Resetuj hasło</h3>
            <p className="mt-2 text-sm text-gray-500">
              Czy na pewno chcesz zresetować hasło użytkownika {user.firstName} {user.lastName}?
              Link zostanie wysłany na adres {user.email}.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmReset(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  resetPassword.mutate(user.id)
                  setConfirmReset(false)
                }}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
              >
                Resetuj
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export { UserDetailPage }