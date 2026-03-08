import { ResetPasswordForm } from '@/app/features/auth/components/reset-password-form'

const ResetPasswordPage = () => (
  <div className="flex flex-col gap-8">
    <div className="flex flex-col gap-1 text-center">
      <h1 className="text-xl font-bold text-gray-900">Reset hasła</h1>
      <p className="text-sm text-gray-500">
        Podaj email — wyślemy Ci link do ustawienia nowego hasła
      </p>
    </div>
    <ResetPasswordForm />
  </div>
)

export { ResetPasswordPage }