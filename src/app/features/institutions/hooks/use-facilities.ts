import { useQuery } from '@tanstack/react-query'
import { institutionsService } from '@/app/services/institutions.service'

export const FACILITIES_KEY = (institutionId: string) =>
  ['facilities', institutionId] as const

const useFacilities = (institutionId: string | null) =>
  useQuery({
    queryKey: FACILITIES_KEY(institutionId ?? ''),
    queryFn: () =>
      institutionsService.getFacilities(institutionId!).then((r) => r.data),
    // odpala się tylko gdy instytucja jest wybrana
    enabled: !!institutionId,
  })

export { useFacilities }