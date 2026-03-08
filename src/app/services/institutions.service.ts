import { axiosInstance } from './axios.instance'

// ── typy ─────────────────────────────────────────────────
export type Institution = {
  id: string
  name: string
}

export type Facility = {
  id: string
  name: string
  institutionId: string
}

// ── endpointy ────────────────────────────────────────────
export const institutionsService = {
  getAll: () =>
    axiosInstance.get<Institution[]>('/institutions'),

  getById: (id: string) =>
    axiosInstance.get<Institution>(`/institutions/${id}`),

  getFacilities: (institutionId: string) =>
    axiosInstance.get<Facility[]>(`/institutions/${institutionId}/facilities`),
}