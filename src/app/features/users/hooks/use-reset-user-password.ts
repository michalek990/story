import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService } from '@/app/services/users.service'

const useResetUserPassword = () =>
  useMutation({
    mutationFn: (id: string) => usersService.resetPassword(id),
    onSuccess: () => {
      toast.success('Link do resetu hasła został wysłany na email użytkownika')
    },
    onError: () => {
      toast.error('Nie udało się zresetować hasła')
    },
  })

export { useResetUserPassword }