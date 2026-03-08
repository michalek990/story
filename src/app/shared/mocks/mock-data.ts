import { User } from '@/app/services/users.service'
import { Institution, Facility } from '@/app/services/institutions.service'

// ── instytucje ────────────────────────────────────────────
export const mockInstitutions: Institution[] = [
  { id: 'inst-1', name: 'Szpital Miejski w Warszawie' },
  { id: 'inst-2', name: 'Klinika Zdrowia Kraków' },
  { id: 'inst-3', name: 'Centrum Medyczne Gdańsk' },
]

// ── zakłady ───────────────────────────────────────────────
export const mockFacilities: Facility[] = [
  { id: 'fac-1', name: 'Oddział Chirurgii',     institutionId: 'inst-1' },
  { id: 'fac-2', name: 'Oddział Kardiologii',   institutionId: 'inst-1' },
  { id: 'fac-3', name: 'Oddział Neurologii',    institutionId: 'inst-1' },
  { id: 'fac-4', name: 'Poradnia Ogólna',       institutionId: 'inst-2' },
  { id: 'fac-5', name: 'Laboratorium',          institutionId: 'inst-2' },
  { id: 'fac-6', name: 'Izba Przyjęć',          institutionId: 'inst-3' },
  { id: 'fac-7', name: 'Oddział Intensywny',    institutionId: 'inst-3' },
]

// ── użytkownicy ───────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: 'user-1',
    firstName: 'Anna',
    lastName: 'Kowalska',
    email: 'anna.kowalska@szpital.pl',
    role: 'admin',
    status: 'active',
    institutionId: 'inst-1',
    institutionName: 'Szpital Miejski w Warszawie',
    facilityId: 'fac-1',
    facilityName: 'Oddział Chirurgii',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
  },
  {
    id: 'user-2',
    firstName: 'Marek',
    lastName: 'Nowak',
    email: 'marek.nowak@szpital.pl',
    role: 'coordinator',
    status: 'active',
    institutionId: 'inst-1',
    institutionName: 'Szpital Miejski w Warszawie',
    facilityId: 'fac-2',
    facilityName: 'Oddział Kardiologii',
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-11-18T11:00:00Z',
  },
  {
    id: 'user-3',
    firstName: 'Katarzyna',
    lastName: 'Wiśniewska',
    email: 'k.wisniewska@klinika.pl',
    role: 'user',
    status: 'active',
    institutionId: 'inst-2',
    institutionName: 'Klinika Zdrowia Kraków',
    facilityId: 'fac-4',
    facilityName: 'Poradnia Ogólna',
    createdAt: '2024-03-05T08:30:00Z',
    updatedAt: '2024-11-10T16:00:00Z',
  },
  {
    id: 'user-4',
    firstName: 'Piotr',
    lastName: 'Zając',
    email: 'p.zajac@klinika.pl',
    role: 'system_admin',
    status: 'inactive',
    institutionId: 'inst-2',
    institutionName: 'Klinika Zdrowia Kraków',
    facilityId: 'fac-5',
    facilityName: 'Laboratorium',
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-10-01T09:00:00Z',
  },
  {
    id: 'user-5',
    firstName: 'Monika',
    lastName: 'Lewandowska',
    email: 'm.lewandowska@cmgdansk.pl',
    role: 'coordinator',
    status: 'active',
    institutionId: 'inst-3',
    institutionName: 'Centrum Medyczne Gdańsk',
    facilityId: 'fac-6',
    facilityName: 'Izba Przyjęć',
    createdAt: '2024-04-12T11:00:00Z',
    updatedAt: '2024-11-22T10:30:00Z',
  },
  {
    id: 'user-6',
    firstName: 'Tomasz',
    lastName: 'Wróbel',
    email: 't.wrobel@cmgdansk.pl',
    role: 'user',
    status: 'inactive',
    institutionId: 'inst-3',
    institutionName: 'Centrum Medyczne Gdańsk',
    facilityId: 'fac-7',
    facilityName: 'Oddział Intensywny',
    createdAt: '2024-05-01T14:00:00Z',
    updatedAt: '2024-09-15T08:00:00Z',
  },
  {
    id: 'user-7',
    firstName: 'Agnieszka',
    lastName: 'Dąbrowska',
    email: 'a.dabrowska@szpital.pl',
    role: 'user',
    status: 'active',
    institutionId: 'inst-1',
    institutionName: 'Szpital Miejski w Warszawie',
    facilityId: 'fac-3',
    facilityName: 'Oddział Neurologii',
    createdAt: '2024-06-20T09:30:00Z',
    updatedAt: '2024-11-19T13:00:00Z',
  },
]

// ── helpery ───────────────────────────────────────────────
export const getMockFacilitiesByInstitution = (institutionId: string) =>
  mockFacilities.filter((f) => f.institutionId === institutionId)

export const getMockUserById = (id: string) =>
  mockUsers.find((u) => u.id === id)