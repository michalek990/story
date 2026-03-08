import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/app'

// ╔══════════════════════════════════════════════════════╗
// ║  DEV MOCKS — usuń ten import gdy backend jest gotowy ║
// ╚══════════════════════════════════════════════════════╝
import '@/app/shared/mocks/mock-handlers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)