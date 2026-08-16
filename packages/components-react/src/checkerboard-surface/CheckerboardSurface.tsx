import type { CSSProperties, ReactNode } from 'react'
import './styles.css'

export type CheckerboardCellSize = 'sm' | 'md' | 'lg'
/** `default` is readable for transparent edges; `strong` for mask / inpaint editors. */
export type CheckerboardContrast = 'default' | 'strong'

export interface CheckerboardSurfaceProps {
  children?: ReactNode
  cellSize?: CheckerboardCellSize
  /** Checker A/B contrast. Prefer `strong` for mask / inpaint stages. */
  contrast?: CheckerboardContrast
  className?: string
  style?: CSSProperties
}

const CELL: Record<CheckerboardCellSize, string> = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
}

export function CheckerboardSurface({
  children,
  cellSize = 'md',
  contrast = 'default',
  className,
  style,
}: CheckerboardSurfaceProps) {
  const classes = ['cu-checkerboard-surface', className].filter(Boolean).join(' ')
  return (
    <div
      className={classes}
      data-ai-role="checkerboard-surface"
      data-ai-intent="show-transparency"
      data-ai-state="default"
      data-cell-size={cellSize}
      data-contrast={contrast}
      style={{ ...style, ['--cu-checkerboard-cell' as string]: CELL[cellSize] }}
    >
      {children}
    </div>
  )
}
