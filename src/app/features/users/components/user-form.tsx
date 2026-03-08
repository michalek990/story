import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/app/shared/utils/common.utils'
import { useInstitutions } from '@/app/features/institutions/hooks/use-institutions'
import { useFacilities } from '@/app/features/institutions/hooks/use-facilities'
import { User } from '@/app/services/users.service'

// ── role ─────────────────────────────────────────────────
export const USER_ROLES = [
  { value: 'admin',            label: 'Admin' },
  { value: 'system_admin',     label: 'Admin systemowy' },
  { value: 'coordinator',      label: 'Koordynator' },
  { value: 'user',             label: 'Użytkownik' },
] as const

// ── schemat ──────────────────────────────────────────────
const userSchema = z.object({
  firstName:     z.string().min(1, 'Imię jest wymagane'),
  lastName:      z.string().min(1, 'Nazwisko jest wymagane'),
  email:         z.string().min(1, 'Email jest wymagany').email('Podaj poprawny email'),
  role:          z.string().min(1, 'Rola jest wymagana'),
  institutionId: z.string().min(1, 'Instytucja jest wymagana'),
  facilityId:    z.string().min(1, 'Zakład jest wymagany'),
})

export type UserFormValues = z.infer<typeof userSchema>

// ── props ────────────────────────────────────────────────
type UserFormProps = {
  defaultValues?: Partial<UserFormValues>
  isLoading?: boolean
  onSubmit: (data: UserFormValues) => void
  submitLabel?: string
}

// ── helpers UI ───────────────────────────────────────────
const inputClass = (hasError: boolean) =>
  cn(
    'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
    'focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
    hasError
      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
      : 'border-gray-200 bg-white',
  )

const Label = ({ htmlFor, children }: { htmlFor: string; children: string }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
    {children}
  </label>
)

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-xs text-red-600">{msg}</p> : null

// ── komponent ────────────────────────────────────────────
const UserForm = ({
  defaultValues,
  isLoading = false,
  onSubmit,
  submitLabel = 'Zapisz',
}: UserFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues ?? {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      institutionId: '',
      facilityId: '',
    },
  })

  const selectedInstitutionId = watch('institutionId')

  const { data: institutions, isLoading: institutionsLoading } = useInstitutions()
  const { data: facilities, isLoading: facilitiesLoading } = useFacilities(
    selectedInstitutionId || null,
  )

  // resetuj zakład gdy zmienia się instytucja
  useEffect(() => {
    if (!defaultValues?.facilityId) {
      setValue('facilityId', '')
    }
  }, [selectedInstitutionId])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {/* imię + nazwisko */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">Imię</Label>
          <input
            id="firstName"
            placeholder="Jan"
            {...register('firstName')}
            className={inputClass(!!errors.firstName)}
          />
          <ErrorMsg msg={errors.firstName?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">Nazwisko</Label>
          <input
            id="lastName"
            placeholder="Kowalski"
            {...register('lastName')}
            className={inputClass(!!errors.lastName)}
          />
          <ErrorMsg msg={errors.lastName?.message} />
        </div>
      </div>

      {/* email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <input
          id="email"
          type="email"
          placeholder="jan@example.com"
          {...register('email')}
          className={inputClass(!!errors.email)}
        />
        <ErrorMsg msg={errors.email?.message} />
      </div>

      {/* rola */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="role">Rola</Label>
        <select
          id="role"
          {...register('role')}
          className={inputClass(!!errors.role)}
        >
          <option value="">Wybierz rolę...</option>
          {USER_ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <ErrorMsg msg={errors.role?.message} />
      </div>

      {/* instytucja */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="institutionId">Instytucja</Label>
        <select
          id="institutionId"
          {...register('institutionId')}
          disabled={institutionsLoading}
          className={inputClass(!!errors.institutionId)}
        >
          <option value="">
            {institutionsLoading ? 'Ładowanie...' : 'Wybierz instytucję...'}
          </option>
          {institutions?.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name}
            </option>
          ))}
        </select>
        <ErrorMsg msg={errors.institutionId?.message} />
      </div>

      {/* zakład */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="facilityId">Zakład</Label>
        <select
          id="facilityId"
          {...register('facilityId')}
          disabled={!selectedInstitutionId || facilitiesLoading}
          className={inputClass(!!errors.facilityId)}
        >
          <option value="">
            {!selectedInstitutionId
              ? 'Najpierw wybierz instytucję'
              : facilitiesLoading
                ? 'Ładowanie...'
                : 'Wybierz zakład...'}
          </option>
          {facilities?.map((fac) => (
            <option key={fac.id} value={fac.id}>
              {fac.name}
            </option>
          ))}
        </select>
        <ErrorMsg msg={errors.facilityId?.message} />
      </div>

      {/* przycisk */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'rounded-lg px-5 py-2 text-sm font-semibold transition-colors',
            'bg-gray-900 text-white hover:bg-gray-700',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {isLoading ? 'Zapisywanie...' : submitLabel}
        </button>
      </div>

    </form>
  )
}

export { UserForm }