import './styles.css'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onChange, className }: PaginationProps) {
  const classes = ['cu-pagination', className].filter(Boolean).join(' ')
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <nav aria-label="Pagination" className={classes} data-ai-role="pagination" data-ai-state="default" data-ai-intent="navigate-pages">
      <div className="cu-pagination__list">
        <button
          className="cu-pagination__button"
          disabled={currentPage <= 1}
          onClick={() => onChange(currentPage - 1)}
          type="button"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            aria-current={page === currentPage ? 'page' : undefined}
            className={'cu-pagination__button' + (page === currentPage ? ' cu-pagination__button--current' : '')}
            key={page}
            onClick={() => onChange(page)}
            type="button"
          >
            {page}
          </button>
        ))}
        <button
          className="cu-pagination__button"
          disabled={currentPage >= totalPages}
          onClick={() => onChange(currentPage + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </nav>
  )
}
