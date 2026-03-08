import { axiosInstance } from './axios.instance'

// ── typy ─────────────────────────────────────────────────
export type UserStatus = 'active' | 'inactive'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: UserStatus
  institutionId: string
  institutionName: string
  facilityId: string
  facilityName: string
  createdAt: string
  updatedAt: string
}

export type UserFilters = {
  institutionId?: string
  facilityId?: string
  search?: string
}

export type CreateUserDto = {
  firstName: string
  lastName: string
  email: string
  role: string
  institutionId: string
  facilityId: string
}

export type UpdateUserDto = Partial<CreateUserDto>

// ── endpointy ────────────────────────────────────────────
export const usersService = {
  getAll: (filters?: UserFilters) =>
    axiosInstance.get<User[]>('/users', { params: filters }),

  getById: (id: string) =>
    axiosInstance.get<User>(`/users/${id}`),

  create: (data: CreateUserDto) =>
    axiosInstance.post<User>('/users', data),

  update: (id: string, data: UpdateUserDto) =>
    axiosInstance.patch<User>(`/users/${id}`, data),

  delete: (id: string) =>
    axiosInstance.delete(`/users/${id}`),

  activate: (id: string) =>
    axiosInstance.patch(`/users/${id}/activate`),

  deactivate: (id: string) =>
    axiosInstance.patch(`/users/${id}/deactivate`),

  resetPassword: (id: string) =>
    axiosInstance.post(`/users/${id}/reset-password`),
}