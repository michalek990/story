import { useNavigate } from 'react-router-dom'
import { UserForm, UserFormValues } from '@/app/features/users/components/user-form'
import { useCreateUser } from '@/app/features/users/hooks/use-create-user'

const AddUserPage = () => {
  const navigate   = useNavigate()
  const createUser = useCreateUser()

  const handleSubmit = (data: UserFormValues) => {
    createUser.mutate(data, {
      onSuccess: () => navigate('/users'),
    })
  }

  return (
    <div className="mx-auto max-w-2xl">

      {/* nagłówek */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/users')}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Użytkownicy
        </button>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Nowy użytkownik</h1>
      </div>

      {/* formularz */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {createUser.isError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Nie udało się dodać użytkownika. Spróbuj ponownie.
          </div>
        )}
        <UserForm
          onSubmit={handleSubmit}
          isLoading={createUser.isPending}
          submitLabel="Dodaj użytkownika"
        />
      </div>

    </div>
  )
}

export { AddUserPage }