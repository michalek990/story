import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService, UserStatus } from '@/app/services/users.service'
import { USERS_KEY } from './use-users'
import { USER_KEY } from './use-user'

const useActivateUser = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (currentStatus: UserStatus) =>
      currentStatus === 'active'
        ? usersService.deactivate(id)
        : usersService.activate(id),
    onSuccess: (_, currentStatus) => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY() })
      queryClient.invalidateQueries({ queryKey: USER_KEY(id) })
      toast.success(
        currentStatus === 'active'
          ? 'Użytkownik został dezaktywowany'
          : 'Użytkownik został aktywowany',
      )
    },
    onError: () => {
      toast.error('Nie udało się zmienić statusu użytkownika')
    },
  })
}

export { useActivateUser }