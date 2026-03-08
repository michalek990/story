import { Component, ReactNode, ErrorInfo } from 'react'

type Props = {
  children: ReactNode
  fallback?: ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // tutaj możesz podpiąć Sentry:
    // Sentry.captureException(error, { extra: info })
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8 text-center">
          <span className="text-6xl font-black text-gray-200">!</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Coś poszło nie tak</h1>
            <p className="mt-1 text-sm text-gray-500">
              Wystąpił nieoczekiwany błąd aplikacji
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-4 max-w-lg rounded-lg bg-red-50 p-4 text-left text-xs text-red-700 overflow-auto">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            Wróć do strony głównej
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }