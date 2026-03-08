import { axiosInstance } from './axios.instance'

// ── typy ────────────────────────────────────────────────
// TODO: dostosuj do odpowiedzi backendu
export type LoginDto = {
  email: string
  password: string
}

export type AuthResponse = {
  token: string        // TODO: zmień na access_token jeśli backend zwraca inaczej
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

// ── endpointy ───────────────────────────────────────────
export const authService = {
  login: (data: LoginDto) =>
    axiosInstance.post<AuthResponse>('/auth/login', data),

  logout: () =>
    axiosInstance.post('/auth/logout'),

  resetPassword: (email: string) =>
    axiosInstance.post('/auth/reset-password', { email }),

  setNewPassword: (token: string, password: string) =>
    axiosInstance.post('/auth/set-new-password', { token, password }),

  me: () =>
    axiosInstance.get<AuthResponse['user']>('/auth/me'),
}