import { cn } from '@/app/shared/utils/common.utils'

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // pokaż max 5 stron naraz
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages
    if (page <= 3) return pages.slice(0, 5)
    if (page >= totalPages - 2) return pages.slice(totalPages - 5)
    return pages.slice(page - 3, page + 2)
  }

  const visiblePages = getVisiblePages()
  const btnBase = 'flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors'

  return (
    <div className="flex items-center justify-between px-1">

      <p className="text-sm text-gray-500">
        Strona <span className="font-medium text-gray-900">{page}</span> z{' '}
        <span className="font-medium text-gray-900">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1">

        {/* poprzednia */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={cn(btnBase, 'border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed')}
        >
          ‹
        </button>

        {/* pierwsza strona + ... */}
        {visiblePages[0] > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className={cn(btnBase, 'border border-gray-200 text-gray-600 hover:bg-gray-50')}>
              1
            </button>
            {visiblePages[0] > 2 && <span className="px-1 text-gray-400">…</span>}
          </>
        )}

        {/* widoczne strony */}
        {visiblePages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              btnBase,
              p === page
                ? 'bg-gray-900 text-white'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50',
            )}
          >
            {p}
          </button>
        ))}

        {/* ... + ostatnia strona */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-1 text-gray-400">…</span>
            )}
            <button onClick={() => onPageChange(totalPages)} className={cn(btnBase, 'border border-gray-200 text-gray-600 hover:bg-gray-50')}>
              {totalPages}
            </button>
          </>
        )}

        {/* następna */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={cn(btnBase, 'border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed')}
        >
          ›
        </button>

      </div>
    </div>
  )
}

export { Pagination }