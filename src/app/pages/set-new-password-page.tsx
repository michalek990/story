import { SetNewPasswordForm } from '@/app/features/auth/components/set-new-password-form'

const SetNewPasswordPage = () => (
  <div className="flex flex-col gap-8">
    <div className="flex flex-col gap-1 text-center">
      <h1 className="text-xl font-bold text-gray-900">Nowe hasło</h1>
      <p className="text-sm text-gray-500">
        Ustaw nowe hasło do swojego konta
      </p>
    </div>
    <SetNewPasswordForm />
  </div>
)

export { SetNewPasswordPage }