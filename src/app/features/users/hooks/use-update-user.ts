import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService, UpdateUserDto } from '@/app/services/users.service'
import { USERS_KEY } from './use-users'
import { USER_KEY } from './use-user'

const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserDto) => usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY() })
      queryClient.invalidateQueries({ queryKey: USER_KEY(id) })
      toast.success('Zmiany zostały zapisane')
    },
    onError: () => {
      toast.error('Nie udało się zapisać zmian')
    },
  })
}

export { useUpdateUser }