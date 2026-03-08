import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/app/services/users.service'

export const USER_KEY = (id: string) => ['users', id] as const

const useUser = (id: string) =>
  useQuery({
    queryKey: USER_KEY(id),
    queryFn: () => usersService.getById(id).then((r) => r.data),
    enabled: !!id,
  })

export { useUser }