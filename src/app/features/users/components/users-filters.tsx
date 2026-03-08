import { useState } from 'react'
import { useInstitutions } from '@/app/features/institutions/hooks/use-institutions'
import { useFacilities } from '@/app/features/institutions/hooks/use-facilities'
import { UserFilters } from '@/app/services/users.service'
import { cn } from '@/app/shared/utils/common.utils'

type UsersFiltersProps = {
  onChange: (filters: UserFilters) => void
}

const UsersFilters = ({ onChange }: UsersFiltersProps) => {
  const [institutionId, setInstitutionId] = useState('')
  const [facilityId, setFacilityId]       = useState('')
  const [search, setSearch]               = useState('')

  const { data: institutions, isLoading: instLoading } = useInstitutions()
  const { data: facilities,   isLoading: facLoading  } = useFacilities(institutionId || null)

  const selectClass = cn(
    'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none',
    'focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors',
    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
  )

  const handleInstitution = (val: string) => {
    setInstitutionId(val)
    setFacilityId('')
    onChange({ institutionId: val || undefined, facilityId: undefined, search: search || undefined })
  }

  const handleFacility = (val: string) => {
    setFacilityId(val)
    onChange({ institutionId: institutionId || undefined, facilityId: val || undefined, search: search || undefined })
  }

  const handleSearch = (val: string) => {
    setSearch(val)
    onChange({ institutionId: institutionId || undefined, facilityId: facilityId || undefined, search: val || undefined })
  }

  const handleClear = () => {
    setInstitutionId('')
    setFacilityId('')
    setSearch('')
    onChange({})
  }

  const hasFilters = !!(institutionId || facilityId || search)

  return (
    <div className="flex flex-wrap items-center gap-3">

      {/* wyszukiwanie */}
      <input
        type="text"
        placeholder="Szukaj po imieniu lub emailu..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className={cn(selectClass, 'min-w-[220px]')}
      />

      {/* instytucja */}
      <select
        value={institutionId}
        onChange={(e) => handleInstitution(e.target.value)}
        disabled={instLoading}
        className={selectClass}
      >
        <option value="">
          {instLoading ? 'Ładowanie...' : 'Wszystkie instytucje'}
        </option>
        {institutions?.map((inst) => (
          <option key={inst.id} value={inst.id}>
            {inst.name}
          </option>
        ))}
      </select>

      {/* zakład */}
      <select
        value={facilityId}
        onChange={(e) => handleFacility(e.target.value)}
        disabled={!institutionId || facLoading}
        className={selectClass}
      >
        <option value="">
          {!institutionId ? 'Wybierz instytucję' : facLoading ? 'Ładowanie...' : 'Wszystkie zakłady'}
        </option>
        {facilities?.map((fac) => (
          <option key={fac.id} value={fac.id}>
            {fac.name}
          </option>
        ))}
      </select>

      {/* wyczyść */}
      {hasFilters && (
        <button
          onClick={handleClear}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors underline underline-offset-2"
        >
          Wyczyść filtry
        </button>
      )}

    </div>
  )
}

export { UsersFilters }