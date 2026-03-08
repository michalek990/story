import { useNavigate } from 'react-router-dom'

const UnauthorizedPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8 text-center">
      <span className="text-6xl font-black text-gray-200">403</span>
      <div>
        <h1 className="text-xl font-bold text-gray-900">Brak uprawnień</h1>
        <p className="mt-1 text-sm text-gray-500">
          Nie masz uprawnień do wyświetlenia tej strony
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
      >
        Wróć do strony głównej
      </button>
    </div>
  )
}

export { UnauthorizedPage }