import { useNavigate, useParams } from 'react-router-dom'
import { UserForm, UserFormValues } from '@/app/features/users/components/user-form'
import { useUser } from '@/app/features/users/hooks/use-user'
import { useUpdateUser } from '@/app/features/users/hooks/use-update-user'

const EditUserPage = () => {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const { data: user, isLoading, isError } = useUser(id!)
  const updateUser = useUpdateUser(id!)

  const handleSubmit = (data: UserFormValues) => {
    updateUser.mutate(data, {
      onSuccess: () => navigate(`/users/${id}`),
    })
  }

  // ładowanie
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="h-8 w-48 rounded bg-gray-100 animate-pulse mb-6" />
        <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // błąd
  if (isError || !user) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
        <p className="text-sm font-medium text-red-700">Nie udało się pobrać danych użytkownika</p>
        <button
          onClick={() => navigate('/users')}
          className="mt-3 text-sm text-red-500 underline hover:text-red-700"
        >
          Wróć do listy
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">

      {/* nagłówek */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate(`/users/${id}`)}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← {user.firstName} {user.lastName}
        </button>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Edytuj użytkownika</h1>
      </div>

      {/* formularz */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {updateUser.isError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Nie udało się zapisać zmian. Spróbuj ponownie.
          </div>
        )}
        <UserForm
          defaultValues={{
            firstName:     user.firstName,
            lastName:      user.lastName,
            email:         user.email,
            role:          user.role,
            institutionId: user.institutionId,
            facilityId:    user.facilityId,
          }}
          onSubmit={handleSubmit}
          isLoading={updateUser.isPending}
          submitLabel="Zapisz zmiany"
        />
      </div>

    </div>
  )
}

export { EditUserPage }