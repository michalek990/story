import { useQuery } from '@tanstack/react-query'
import { institutionsService } from '@/app/services/institutions.service'

export const INSTITUTIONS_KEY = ['institutions'] as const

const useInstitutions = () =>
  useQuery({
    queryKey: INSTITUTIONS_KEY,
    queryFn: () => institutionsService.getAll().then((r) => r.data),
  })

export { useInstitutions }