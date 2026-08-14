import type { ReactNode } from 'react'
import './styles.css'

export interface NavbarItem {
  value: string
  label: ReactNode
  href?: string
}

export interface NavbarProps {
  label: string
  items: NavbarItem[]
  brand?: ReactNode
  activeValue?: string
  onSelect?: (value: string) => void
  className?: string
}

export function Navbar({
  label,
  items,
  brand,
  activeValue,
  onSelect,
  className,
}: NavbarProps) {
  const classes = ['cu-navbar', className].filter(Boolean).join(' ')

  return (
    <nav
      className={classes}
      aria-label={label}
      data-ai-role="navbar"
      data-ai-intent="navigate-sections"
      data-ai-state={activeValue ? 'active' : 'default'}
    >
      <div className="cu-navbar__frame">
        {brand ? <div className="cu-navbar__brand">{brand}</div> : null}
        <ul className="cu-navbar__list">
          {items.map((item) => {
            const current = activeValue === item.value
            const itemClass = 'cu-navbar__item'
            const labelNode = <span className="cu-navbar__label">{item.label}</span>
            return (
              <li key={item.value} className="cu-navbar__entry">
                {item.href ? (
                  <a
                    className={itemClass}
                    href={item.href}
                    aria-current={current ? 'page' : undefined}
                    onClick={() => onSelect?.(item.value)}
                  >
                    {labelNode}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={itemClass}
                    aria-current={current ? 'page' : undefined}
                    onClick={() => onSelect?.(item.value)}
                  >
                    {labelNode}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
