import { useEffect, useRef } from 'react'

const TIMEOUT_MS = 30 * 60 * 1000 // 30 minut

type UseSessionTimeoutProps = {
  onTimeout: () => void
  enabled: boolean
}

const useSessionTimeout = ({ onTimeout, enabled }: UseSessionTimeoutProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(onTimeout, TIMEOUT_MS)
  }

  useEffect(() => {
    if (!enabled) return

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']

    // start timera
    resetTimer()

    // reset przy każdej aktywności usera
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((e) => window.removeEventListener(e, resetTimer))
    }
  }, [enabled])
}

export { useSessionTimeout, TIMEOUT_MS }