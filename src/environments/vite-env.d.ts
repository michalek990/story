/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_ENV: 'local' | 'test' | 'prod';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
