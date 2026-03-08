import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { axiosInstance } from '@/app/services/axios.instance'
import {
  mockUsers,
  mockInstitutions,
  mockFacilities,
  getMockFacilitiesByInstitution,
  getMockUserById,
} from './mock-data'

// ╔══════════════════════════════════════════════════════╗
// ║  MOCK ADAPTER — podmienia requesty axios na dane     ║
// ║  z mock-data.ts bez prawdziwego backendu             ║
// ║                                                      ║
// ║  Aby wyłączyć: w main.tsx usuń import               ║
// ║  '@/app/shared/mocks/mock-handlers'                  ║
// ╚══════════════════════════════════════════════════════╝

const mock = new MockAdapter(axiosInstance, { delayResponse: 400 })

// ── auth ─────────────────────────────────────────────────
mock.onPost('/auth/login').reply(200, {
  token: 'mock-token-123',
  user: { id: 'dev-1', email: 'admin@example.com', name: 'Admin Dev', role: 'admin' },
})

mock.onPost('/auth/logout').reply(200)

mock.onGet('/auth/me').reply(200, {
  id: 'dev-1', email: 'admin@example.com', name: 'Admin Dev', role: 'admin',
})

mock.onPost('/auth/reset-password').reply(200)
mock.onPost('/auth/set-new-password').reply(200)

// ── instytucje ────────────────────────────────────────────
mock.onGet('/institutions').reply(200, mockInstitutions)

mock.onGet(/\/institutions\/(.+)\/facilities/).reply((config) => {
  const match = config.url?.match(/\/institutions\/(.+)\/facilities/)
  const institutionId = match?.[1] ?? ''
  return [200, getMockFacilitiesByInstitution(institutionId)]
})

mock.onGet(/\/institutions\/[^/]+$/).reply((config) => {
  const id = config.url?.split('/').pop() ?? ''
  const inst = mockInstitutions.find((i) => i.id === id)
  return inst ? [200, inst] : [404, { message: 'Nie znaleziono instytucji' }]
})

// ── użytkownicy ───────────────────────────────────────────
mock.onGet('/users').reply((config) => {
  let result = [...mockUsers]
  const { institutionId, facilityId, search } = config.params ?? {}

  if (institutionId) result = result.filter((u) => u.institutionId === institutionId)
  if (facilityId)    result = result.filter((u) => u.facilityId    === facilityId)
  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    )
  }

  return [200, result]
})

mock.onGet(/\/users\/[^/]+$/).reply((config) => {
  const id = config.url?.split('/').pop() ?? ''
  const user = getMockUserById(id)
  return user ? [200, user] : [404, { message: 'Nie znaleziono użytkownika' }]
})

mock.onPost('/users').reply((config) => {
  const data = JSON.parse(config.data)
  const inst = mockInstitutions.find((i) => i.id === data.institutionId)
  const fac  = mockFacilities.find((f) => f.id === data.facilityId)
  const newUser = {
    ...data,
    id: `user-${Date.now()}`,
    status: 'active',
    institutionName: inst?.name ?? '',
    facilityName: fac?.name ?? '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockUsers.push(newUser)
  return [201, newUser]
})

mock.onPatch(/\/users\/(.+)\/activate/).reply((config) => {
  const id = config.url?.match(/\/users\/(.+)\/activate/)?.[1] ?? ''
  const user = getMockUserById(id)
  if (user) user.status = 'active'
  return [200, user]
})

mock.onPatch(/\/users\/(.+)\/deactivate/).reply((config) => {
  const id = config.url?.match(/\/users\/(.+)\/deactivate/)?.[1] ?? ''
  const user = getMockUserById(id)
  if (user) user.status = 'inactive'
  return [200, user]
})

mock.onPatch(/\/users\/[^/]+$/).reply((config) => {
  const id   = config.url?.split('/').pop() ?? ''
  const data = JSON.parse(config.data)
  const user = getMockUserById(id)
  if (!user) return [404, { message: 'Nie znaleziono użytkownika' }]
  Object.assign(user, data, { updatedAt: new Date().toISOString() })
  return [200, user]
})

mock.onDelete(/\/users\/[^/]+$/).reply((config) => {
  const id  = config.url?.split('/').pop() ?? ''
  const idx = mockUsers.findIndex((u) => u.id === id)
  if (idx !== -1) mockUsers.splice(idx, 1)
  return [204]
})

mock.onPost(/\/users\/.+\/reset-password/).reply(200)

export default mock