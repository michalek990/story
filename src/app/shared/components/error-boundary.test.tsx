import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from './error-boundary'

// komponent który celowo rzuca błąd
const BrokenComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Test error')
  return <div>Działa poprawnie</div>
}

// wycisz console.error dla testów error boundary
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('ErrorBoundary', () => {

  it('renderuje dzieci gdy nie ma błędu', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={false} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Działa poprawnie')).toBeInTheDocument()
  })

  it('pokazuje fallback UI gdy komponent rzuca błąd', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Coś poszło nie tak')).toBeInTheDocument()
    expect(screen.getByText('Wystąpił nieoczekiwany błąd aplikacji')).toBeInTheDocument()
  })

  it('pokazuje custom fallback jeśli podany', () => {
    render(
      <ErrorBoundary fallback={<div>Custom błąd</div>}>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Custom błąd')).toBeInTheDocument()
  })

  it('ma przycisk powrotu do strony głównej', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Wróć do strony głównej')).toBeInTheDocument()
  })

  it('loguje błąd do konsoli', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>,
    )
    expect(console.error).toHaveBeenCalled()
  })
})