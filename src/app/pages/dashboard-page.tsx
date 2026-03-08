import { useUsers } from '@/app/features/users/hooks/use-users'
import { useInstitutions } from '@/app/features/institutions/hooks/use-institutions'
import { useAuth } from '@/app/providers/auth-provider'

const StatCard = ({
  label,
  value,
  isLoading,
}: {
  label: string
  value?: number
  isLoading?: boolean
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5">
    <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
    <dd className="mt-2">
      {isLoading ? (
        <div className="h-8 w-16 rounded bg-gray-100 animate-pulse" />
      ) : (
        <span className="text-3xl font-bold text-gray-900">{value ?? 0}</span>
      )}
    </dd>
  </div>
)

const DashboardPage = () => {
  const { user } = useAuth()
  const { data: users, isLoading: usersLoading }               = useUsers()
  const { data: institutions, isLoading: institutionsLoading } = useInstitutions()

  const activeUsers   = users?.filter((u) => u.status === 'active').length ?? 0
  const inactiveUsers = users?.filter((u) => u.status === 'inactive').length ?? 0

  return (
    <div className="flex flex-col gap-8">

      {/* powitanie */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Witaj, {user?.name ?? 'Admin'} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Oto podsumowanie systemu
        </p>
      </div>

      {/* karty statystyk */}
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Wszyscy użytkownicy"
          value={users?.length}
          isLoading={usersLoading}
        />
        <StatCard
          label="Aktywni"
          value={activeUsers}
          isLoading={usersLoading}
        />
        <StatCard
          label="Nieaktywni"
          value={inactiveUsers}
          isLoading={usersLoading}
        />
        <StatCard
          label="Instytucje"
          value={institutions?.length}
          isLoading={institutionsLoading}
        />
      </dl>

    </div>
  )
}

export { DashboardPage }