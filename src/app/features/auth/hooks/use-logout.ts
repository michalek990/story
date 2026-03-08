import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '@/app/services/auth.service'
import { useAuth } from '@/app/providers/auth-provider'

const useLogout = () => {
  const navigate = useNavigate()
  const { clearAuth } = useAuth()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth()
      toast.success('Wylogowano pomyślnie')
      navigate('/login')
    },
  })
}

export { useLogout }