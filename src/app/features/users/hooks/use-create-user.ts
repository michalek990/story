import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService, CreateUserDto } from '@/app/services/users.service'
import { USERS_KEY } from './use-users'

const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserDto) => usersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY() })
      toast.success('Użytkownik został dodany')
    },
    onError: () => {
      toast.error('Nie udało się dodać użytkownika')
    },
  })
}

export { useCreateUser }