import './styles.css'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: string
  className?: string
}

export function Breadcrumb({ items, separator = '/', className }: BreadcrumbProps) {
  const classes = ['cu-breadcrumb', className].filter(Boolean).join(' ')
  return (
    <nav aria-label="Breadcrumb" className={classes} data-ai-role="breadcrumb" data-ai-state="default" data-ai-intent="navigate-hierarchy">
      <ol className="cu-breadcrumb__list">
        {items.map((item, index) => (
          <li className="cu-breadcrumb__item" key={index}>
            {item.href ? (
              <a className="cu-breadcrumb__link" href={item.href}>{item.label}</a>
            ) : (
              <span className="cu-breadcrumb__current" aria-current="page">{item.label}</span>
            )}
            {index < items.length - 1 && <span className="cu-breadcrumb__separator" aria-hidden="true">{separator}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
