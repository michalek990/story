import axios from 'axios'
import { toast } from 'sonner'
import { httpConfig } from '@/environments/http.config'

const TOKEN_KEY         = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const axiosInstance = axios.create({
  baseURL: httpConfig.baseUrl,
  headers: { 'Content-Type': 'application/json' },
})

// ── helpers ───────────────────────────────────────────────
const getToken         = () => sessionStorage.getItem(TOKEN_KEY)
const getRefreshToken  = () => sessionStorage.getItem(REFRESH_TOKEN_KEY)
const setTokens        = (token: string, refreshToken: string) => {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}
const clearTokens      = () => {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
}

export { getToken, setTokens, clearTokens }

// czy trwa już odświeżanie tokenu — zapobiega wielu równoległym requestom
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token!)
  })
  failedQueue = []
}

// ── request interceptor ───────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// ── response interceptor ──────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // ── 401 — spróbuj odświeżyć token ────────────────────
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getRefreshToken()

      // brak refresh tokenu — wyloguj
      if (!refreshToken) {
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // jeśli już trwa odświeżanie — poczekaj w kolejce
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axiosInstance(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${httpConfig.baseUrl}/auth/refresh`,
          { refreshToken },
        )

        // TODO: dostosuj do odpowiedzi backendu
        const newToken        = data.token
        const newRefreshToken = data.refreshToken ?? data.refresh_token

        setTokens(newToken, newRefreshToken)
        processQueue(null, newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosInstance(originalRequest)

      } catch (refreshError) {
        processQueue(refreshError, null)
        clearTokens()
        toast.error('Sesja wygasła — zaloguj się ponownie')
        window.location.href = '/login'
        return Promise.reject(refreshError)

      } finally {
        isRefreshing = false
      }
    }

    // ── inne błędy ────────────────────────────────────────
    if (error.response?.status === 403) {
      toast.error('Brak uprawnień do wykonania tej operacji')
    }

    if (error.response?.status === 500) {
      toast.error('Błąd serwera — spróbuj ponownie za chwilę')
    }

    if (!error.response) {
      toast.error('Brak połączenia z serwerem')
    }

    return Promise.reject(error)
  },
)