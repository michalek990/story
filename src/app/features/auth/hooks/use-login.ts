import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { authService, LoginDto } from '@/app/services/auth.service'
import { useAuth } from '@/app/providers/auth-provider'

type ApiError = { message: string }

const useLogin = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuth()

  return useMutation<
    Awaited<ReturnType<typeof authService.login>>,
    AxiosError<ApiError>,
    LoginDto
  >({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (res) => {
      const { token, user } = res.data
      // TODO: dostosuj nazwę pola refresh tokenu do odpowiedzi backendu
      const refreshToken = (res.data as any).refreshToken ?? (res.data as any).refresh_token
      setAuth(user, token, refreshToken)
      toast.success(`Witaj, ${user.name}!`)
      navigate('/')
    },
    onError: () => {
      toast.error('Nieprawidłowy email lub hasło')
    },
  })
}

export { useLogin }