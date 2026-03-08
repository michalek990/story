import { env } from './env'

export const httpConfig = {
  baseUrl: env.VITE_API_URL,
}