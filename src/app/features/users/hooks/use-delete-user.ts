import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService } from '@/app/services/users.service'
import { USERS_KEY } from './use-users'

const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY() })
      toast.success('Użytkownik został usunięty')
    },
    onError: () => {
      toast.error('Nie udało się usunąć użytkownika')
    },
  })
}

export { useDeleteUser }