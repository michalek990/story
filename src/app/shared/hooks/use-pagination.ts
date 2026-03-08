import { useState, useMemo } from 'react'

const PAGE_SIZE = 10

const usePagination = <T>(data: T[] | undefined, pageSize = PAGE_SIZE) => {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil((data?.length ?? 0) / pageSize)

  // resetuj do strony 1 gdy dane się zmieniają
  const paginatedData = useMemo(() => {
    if (!data) return []
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize])

  const goToPage = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }

  // reset gdy zmieniają się dane (np. po filtrowaniu)
  const reset = () => setPage(1)

  return {
    page,
    totalPages,
    paginatedData,
    goToPage,
    reset,
    totalItems: data?.length ?? 0,
  }
}

export { usePagination }