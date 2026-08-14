import type { ReactNode } from 'react'
import './styles.css'

export interface NavigationBarProps {
  /** Current view-controller title (UINavigationBar.title). */
  title: ReactNode
  /** Previous controller title; shown on the back control when `onBack` is set. */
  backLabel?: string
  onBack?: () => void
  leading?: ReactNode
  trailing?: ReactNode
  className?: string
}

export function NavigationBar({
  title,
  backLabel = 'Back',
  onBack,
  leading,
  trailing,
  className,
}: NavigationBarProps) {
  const nested = Boolean(onBack)
  const classes = ['cu-navigation-bar', className].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      data-ai-role="navigation-bar"
      data-ai-intent="navigate-stack"
      data-ai-state={nested ? 'nested' : 'root'}
    >
      <div className="cu-navigation-bar__frame">
        <div className="cu-navigation-bar__leading">
          {onBack ? (
            <button type="button" className="cu-navigation-bar__back" onClick={onBack}>
              <span aria-hidden="true" className="cu-navigation-bar__back-icon">
                <svg viewBox="0 0 24 24" className="cu-navigation-bar__back-svg">
                  <path
                    d="M15 6l-6 6 6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </span>
              <span className="cu-navigation-bar__back-label">{backLabel}</span>
            </button>
          ) : (
            leading
          )}
        </div>
        <h1 className="cu-navigation-bar__title">{title}</h1>
        <div className="cu-navigation-bar__trailing">{trailing}</div>
      </div>
    </div>
  )
}
