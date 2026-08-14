import './styles.css'

export type CanvasToolbarAction = 'zoom-in' | 'zoom-out' | 'reset' | 'fit'

export interface CanvasToolbarProps {
  label: string
  zoomInLabel: string
  zoomOutLabel: string
  resetLabel: string
  fitLabel: string
  onAction: (action: CanvasToolbarAction) => void
  className?: string
}

export function CanvasToolbar({
  label,
  zoomInLabel,
  zoomOutLabel,
  resetLabel,
  fitLabel,
  onAction,
  className,
}: CanvasToolbarProps) {
  const classes = ['cu-canvas-toolbar', className].filter(Boolean).join(' ')
  return (
    <div className={classes} role="toolbar" aria-label={label} data-ai-role="canvas-toolbar" data-ai-intent="choose-action" data-ai-state="default">
      <button type="button" className="cu-canvas-toolbar__button" aria-label={zoomInLabel} onClick={() => onAction('zoom-in')}>
        <span aria-hidden="true">+</span>
      </button>
      <button type="button" className="cu-canvas-toolbar__button" aria-label={zoomOutLabel} onClick={() => onAction('zoom-out')}>
        <span aria-hidden="true">−</span>
      </button>
      <button type="button" className="cu-canvas-toolbar__button" aria-label={resetLabel} onClick={() => onAction('reset')}>
        <span aria-hidden="true">⟲</span>
      </button>
      <button type="button" className="cu-canvas-toolbar__button" aria-label={fitLabel} onClick={() => onAction('fit')}>
        <span aria-hidden="true">⛶</span>
      </button>
    </div>
  )
}
