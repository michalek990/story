const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const httpConfig = {
  baseUrl: API_URL,
};
