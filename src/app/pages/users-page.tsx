import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '@/app/features/users/hooks/use-users'
import { UsersTable } from '@/app/features/users/components/users-table'
import { UsersFilters } from '@/app/features/users/components/users-filters'
import { UserFilters } from '@/app/services/users.service'

const UsersPage = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<UserFilters>({})
  const { data, isLoading, isError } = useUsers(filters)

  return (
    <div className="flex flex-col gap-6">

      {/* nagłówek */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Użytkownicy</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {isLoading ? '...' : `${data?.length ?? 0} użytkowników`}
          </p>
        </div>
        <button
          onClick={() => navigate('/users/new')}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
        >
          + Dodaj użytkownika
        </button>
      </div>

      {/* filtry */}
      <UsersFilters onChange={setFilters} />

      {/* tabela */}
      <UsersTable data={data} isLoading={isLoading} isError={isError} />

    </div>
  )
}

export { UsersPage }