import { useNavigate } from 'react-router-dom'
import { User } from '@/app/services/users.service'
import { UserActions } from './user-actions'
import { cn } from '@/app/shared/utils/common.utils'

// ── badge statusu ─────────────────────────────────────────
const StatusBadge = ({ status }: { status: User['status'] }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
      status === 'active'
        ? 'bg-green-100 text-green-700'
        : 'bg-gray-100 text-gray-500',
    )}
  >
    <span
      className={cn(
        'h-1.5 w-1.5 rounded-full',
        status === 'active' ? 'bg-green-500' : 'bg-gray-400',
      )}
    />
    {status === 'active' ? 'Aktywny' : 'Nieaktywny'}
  </span>
)

// ── skeleton ──────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-gray-100">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 rounded bg-gray-100 animate-pulse" style={{ width: `${60 + (i * 13) % 40}%` }} />
      </td>
    ))}
  </tr>
)

// ── props ─────────────────────────────────────────────────
type UsersTableProps = {
  data?: User[]
  isLoading?: boolean
  isError?: boolean
}

// ── komponent ─────────────────────────────────────────────
const UsersTable = ({ data, isLoading, isError }: UsersTableProps) => {
  const navigate = useNavigate()

  // błąd
  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
        <p className="text-sm font-medium text-red-700">Nie udało się pobrać listy użytkowników</p>
        <p className="mt-1 text-xs text-red-500">Sprawdź połączenie z API i spróbuj ponownie</p>
      </div>
    )
  }

  // brak wyników
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center">
        <p className="text-sm font-medium text-gray-900">Brak użytkowników</p>
        <p className="mt-1 text-xs text-gray-500">Zmień filtry lub dodaj nowego użytkownika</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* nagłówki */}
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {['Użytkownik', 'Email', 'Instytucja', 'Zakład', 'Status', ''].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* skeleton */}
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

            {/* dane */}
            {!isLoading &&
              data?.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/users/${user.id}`)}
                  className="border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 last:border-0"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3 text-gray-500">{user.institutionName}</td>
                  <td className="px-4 py-3 text-gray-500">{user.facilityName}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td
                    className="px-4 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <UserActions user={user} />
                  </td>
                </tr>
              ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export { UsersTable }