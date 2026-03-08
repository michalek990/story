import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePagination } from './use-pagination'

const makeData = (n: number) => Array.from({ length: n }, (_, i) => ({ id: i + 1 }))

describe('usePagination', () => {

  it('zwraca pierwszą stronę danych', () => {
    const data = makeData(25)
    const { result } = renderHook(() => usePagination(data, 10))

    expect(result.current.page).toBe(1)
    expect(result.current.paginatedData).toHaveLength(10)
    expect(result.current.paginatedData[0]).toEqual({ id: 1 })
  })

  it('oblicza poprawną liczbę stron', () => {
    const { result: r1 } = renderHook(() => usePagination(makeData(25), 10))
    expect(r1.current.totalPages).toBe(3)

    const { result: r2 } = renderHook(() => usePagination(makeData(10), 10))
    expect(r2.current.totalPages).toBe(1)

    const { result: r3 } = renderHook(() => usePagination(makeData(11), 10))
    expect(r3.current.totalPages).toBe(2)
  })

  it('zmienia stronę po goToPage', () => {
    const data = makeData(25)
    const { result } = renderHook(() => usePagination(data, 10))

    act(() => result.current.goToPage(2))

    expect(result.current.page).toBe(2)
    expect(result.current.paginatedData[0]).toEqual({ id: 11 })
    expect(result.current.paginatedData).toHaveLength(10)
  })

  it('ostatnia strona może mieć mniej elementów', () => {
    const data = makeData(25)
    const { result } = renderHook(() => usePagination(data, 10))

    act(() => result.current.goToPage(3))

    expect(result.current.paginatedData).toHaveLength(5)
  })

  it('nie wychodzi poza zakres stron', () => {
    const data = makeData(10)
    const { result } = renderHook(() => usePagination(data, 10))

    act(() => result.current.goToPage(99))
    expect(result.current.page).toBe(1)

    act(() => result.current.goToPage(-1))
    expect(result.current.page).toBe(1)
  })

  it('reset wraca do strony 1', () => {
    const data = makeData(25)
    const { result } = renderHook(() => usePagination(data, 10))

    act(() => result.current.goToPage(3))
    expect(result.current.page).toBe(3)

    act(() => result.current.reset())
    expect(result.current.page).toBe(1)
  })

  it('działa z undefined data', () => {
    const { result } = renderHook(() => usePagination(undefined, 10))

    expect(result.current.totalPages).toBe(0)
    expect(result.current.paginatedData).toHaveLength(0)
    expect(result.current.totalItems).toBe(0)
  })

  it('zwraca poprawny totalItems', () => {
    const { result } = renderHook(() => usePagination(makeData(25), 10))
    expect(result.current.totalItems).toBe(25)
  })
})
