import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { BrandMark } from '../brand-mark/BrandMark.js'
import './styles.css'

export type TitleBarDensity = 'default' | 'compact'

export interface TitleBarProps {
  /** Product name — accessible name of the brand control. */
  title: string
  /** Short tagline; hidden when density is compact (or Navigation rail is collapsed). */
  subtitle?: string
  /** Raster logo (png / jpeg / webp). Prefer `logo` for SVG / Icon / arbitrary mark. */
  logoSrc?: string
  /** Alt text for `logoSrc`. Defaults to `title`. */
  logoAlt?: string
  /** Custom mark node (SVG / Icon). Wins over `logoSrc` when provided. */
  logo?: ReactNode
  /**
   * Density. `compact` shows the mark only (letter fallback when no logo).
   * Inside a collapsed Navigation rail, CSS also hides the text block.
   */
  density?: TitleBarDensity
  /**
   * Home URL. When set and interactive, the root is an `<a>`.
   * Click priority: `onBrandClick` runs first; the link navigates unless the
   * handler calls `preventDefault()`.
   */
  homeHref?: string
  /** Brand activation handler (home / reset). Prefer this for SPA tab reset. */
  onBrandClick?: (event: ReactMouseEvent | ReactKeyboardEvent) => void
  /** When false, chrome is static (no link, no keyboard activation). Default true. */
  brandInteractive?: boolean
  /** Suppress the context menu on brand chrome. Default true. */
  preventContextMenu?: boolean
  /** Apply `user-select: none`. Default true. */
  userSelectNone?: boolean
  /** Override accessible name (defaults to `title`). */
  homeLabel?: string
  className?: string
}

function letterFallback(title: string) {
  const letter = Array.from(title.trim())[0] ?? '?'
  return (
    <span className="cu-title-bar__letter" aria-hidden="true">
      {letter}
    </span>
  )
}

export function TitleBar({
  title,
  subtitle,
  logoSrc,
  logoAlt,
  logo,
  density = 'default',
  homeHref,
  onBrandClick,
  brandInteractive = true,
  preventContextMenu = true,
  userSelectNone = true,
  homeLabel,
  className,
}: TitleBarProps) {
  const compact = density === 'compact'
  const classes = [
    'cu-title-bar',
    compact && 'cu-title-bar--compact',
    brandInteractive && 'cu-title-bar--interactive',
    userSelectNone && 'cu-title-bar--no-select',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const accessibleName = homeLabel ?? title
  const mark =
    logo ??
    (logoSrc ? (
      <BrandMark src={logoSrc} alt={logoAlt || title} size={compact ? 'sm' : 'md'} />
    ) : (
      letterFallback(title)
    ))

  const body = (
    <>
      <span className="cu-title-bar__mark">{mark}</span>
      <span className="cu-title-bar__text">
        <span className="cu-title-bar__title">{title}</span>
        {subtitle ? <span className="cu-title-bar__subtitle">{subtitle}</span> : null}
      </span>
    </>
  )

  function onContextMenu(event: ReactMouseEvent) {
    if (preventContextMenu) event.preventDefault()
  }

  function onActivate(event: ReactMouseEvent | ReactKeyboardEvent) {
    onBrandClick?.(event)
  }

  function onKeyDown(event: ReactKeyboardEvent) {
    if (!brandInteractive) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onActivate(event)
  }

  if (!brandInteractive) {
    return (
      <div
        className={classes}
        data-density={density}
        data-interactive="false"
        data-ai-role="title-bar"
        data-ai-intent="navigate"
        data-ai-state={compact ? 'compact' : 'default'}
        onContextMenu={onContextMenu}
      >
        {body}
      </div>
    )
  }

  if (homeHref) {
    return (
      <a
        className={classes}
        href={homeHref}
        aria-label={accessibleName}
        title={compact ? title : undefined}
        data-density={density}
        data-interactive="true"
        data-ai-role="title-bar"
        data-ai-intent="navigate"
        data-ai-state={compact ? 'compact' : 'default'}
        onClick={onActivate}
        onKeyDown={onKeyDown}
        onContextMenu={onContextMenu}
      >
        {body}
      </a>
    )
  }

  return (
    <div
      className={classes}
      role="button"
      tabIndex={0}
      aria-label={accessibleName}
      title={compact ? title : undefined}
      data-density={density}
      data-interactive="true"
      data-ai-role="title-bar"
      data-ai-intent="navigate"
      data-ai-state={compact ? 'compact' : 'default'}
      onClick={onActivate}
      onKeyDown={onKeyDown}
      onContextMenu={onContextMenu}
    >
      {body}
    </div>
  )
}
