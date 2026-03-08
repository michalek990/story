import { useState, useEffect, useRef } from 'react'
import { TIMEOUT_MS } from '@/app/shared/hooks/use-session-timeout'

// ostrzeżenie pojawia się 2 minuty przed wylogowaniem
const WARNING_BEFORE_MS = 2 * 60 * 1000

type SessionTimeoutWarningProps = {
  onExtend: () => void
  onLogout: () => void
  enabled: boolean
}

const SessionTimeoutWarning = ({ onExtend, onLogout, enabled }: SessionTimeoutWarningProps) => {
  const [show, setShow]           = useState(false)
  const [secondsLeft, setSeconds] = useState(WARNING_BEFORE_MS / 1000)
  const warningTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimers = () => {
    if (warningTimer.current)  clearTimeout(warningTimer.current)
    if (countdownRef.current)  clearInterval(countdownRef.current)
  }

  const startWarningTimer = () => {
    clearTimers()
    setShow(false)

    // pokaż ostrzeżenie 2 minuty przed końcem sesji
    warningTimer.current = setTimeout(() => {
      setShow(true)
      setSeconds(WARNING_BEFORE_MS / 1000)

      countdownRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(countdownRef.current!)
            return 0
          }
          return s - 1
        })
      }, 1000)
    }, TIMEOUT_MS - WARNING_BEFORE_MS)
  }

  useEffect(() => {
    if (!enabled) return
    startWarningTimer()

    // resetuj timer przy aktywności — tylko jeśli ostrzeżenie nie jest pokazane
    const handleActivity = () => {
      if (!show) startWarningTimer()
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart']
    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }))

    return () => {
      clearTimers()
      events.forEach((e) => window.removeEventListener(e, handleActivity))
    }
  }, [enabled, show])

  const handleExtend = () => {
    setShow(false)
    onExtend()
    startWarningTimer()
  }

  if (!show) return null

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xl shrink-0">
            ⏱
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Sesja wygaśnie za</h3>
            <p className="text-2xl font-bold text-amber-600 tabular-nums">
              {minutes}:{String(seconds).padStart(2, '0')}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          Ze względów bezpieczeństwa zostaniesz automatycznie wylogowany z powodu braku aktywności.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Wyloguj teraz
          </button>
          <button
            onClick={handleExtend}
            className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            Zostań zalogowany
          </button>
        </div>

      </div>
    </div>
  )
}

export { SessionTimeoutWarning }