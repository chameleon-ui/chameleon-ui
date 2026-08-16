import type { ReactNode } from 'react'
import './styles.css'

export interface NavigationTitleProps {
  /** Current view-controller title (UINavigationBar.title). */
  title: ReactNode
  /** Previous controller title; shown on the back control when `onBack` is set. */
  backLabel?: string
  onBack?: () => void
  leading?: ReactNode
  trailing?: ReactNode
  className?: string
}

/** @deprecated Use `NavigationTitleProps`. Kept for EraseLab / consumer continuity. */
export type NavigationBarProps = NavigationTitleProps

export function NavigationTitle({
  title,
  backLabel = 'Back',
  onBack,
  leading,
  trailing,
  className,
}: NavigationTitleProps) {
  const nested = Boolean(onBack)
  // Dual root class during rename: cu-navigation-title canonical, cu-navigation-bar legacy.
  const classes = ['cu-navigation-title', 'cu-navigation-bar', className].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      data-ai-role="navigation-title"
      data-ai-intent="navigate-stack"
      data-ai-state={nested ? 'nested' : 'root'}
    >
      <div className="cu-navigation-title__frame cu-navigation-bar__frame">
        <div className="cu-navigation-title__leading cu-navigation-bar__leading">
          {onBack ? (
            <button
              type="button"
              className="cu-navigation-title__back cu-navigation-bar__back"
              onClick={onBack}
            >
              <span aria-hidden="true" className="cu-navigation-title__back-icon cu-navigation-bar__back-icon">
                <svg viewBox="0 0 24 24" className="cu-navigation-title__back-svg cu-navigation-bar__back-svg">
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
              <span className="cu-navigation-title__back-label cu-navigation-bar__back-label">{backLabel}</span>
            </button>
          ) : (
            leading
          )}
        </div>
        <h1 className="cu-navigation-title__title cu-navigation-bar__title">{title}</h1>
        <div className="cu-navigation-title__trailing cu-navigation-bar__trailing">{trailing}</div>
      </div>
    </div>
  )
}

/** @deprecated Use `NavigationTitle`. Kept for EraseLab / consumer continuity. */
export const NavigationBar = NavigationTitle
