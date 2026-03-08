import { useQuery } from '@tanstack/react-query'
import { usersService, UserFilters } from '@/app/services/users.service'

export const USERS_KEY = (filters?: UserFilters) =>
  ['users', filters] as const

const useUsers = (filters?: UserFilters) =>
  useQuery({
    queryKey: USERS_KEY(filters),
    queryFn: () => usersService.getAll(filters).then((r) => r.data),
  })

export { useUsers }