import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().min(1),
  VITE_APP_ENV: z.enum(['local', 'test', 'prod']).default('local'),
})

type Env = z.infer<typeof envSchema>

const validateEnv = (): Env => {
  try {
    const result = envSchema.parse({
      VITE_API_URL: import.meta.env['VITE_API_URL'],
      VITE_APP_ENV: import.meta.env['VITE_APP_ENV'],
    })
    console.info(`[ENV] ${result.VITE_APP_ENV} → ${result.VITE_API_URL}`)
    return result
  } catch {
    const defaults: Env = {
      VITE_API_URL: 'http://localhost:8080',
      VITE_APP_ENV: 'local',
    }
    console.warn('[ENV] Brak pliku .env — używam domyślnych:', defaults.VITE_API_URL)
    return defaults
  }
}

export const env = validateEnv()