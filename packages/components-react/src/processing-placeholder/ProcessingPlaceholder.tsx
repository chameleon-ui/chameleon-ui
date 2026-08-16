import type { ReactNode } from 'react'
import { Spinner } from '../spinner/Spinner.js'
import './styles.css'

export interface ProcessingPlaceholderProps {
  title: string
  description?: string
  thumbnailSrc?: string
  thumbnailAlt?: string
  spinnerLabel?: string
  action?: ReactNode
  className?: string
}

export function ProcessingPlaceholder({
  title,
  description,
  thumbnailSrc,
  thumbnailAlt = '',
  spinnerLabel = 'Processing',
  action,
  className,
}: ProcessingPlaceholderProps) {
  const classes = ['cu-processing-placeholder', className].filter(Boolean).join(' ')
  return (
    <div
      className={classes}
      role="status"
      aria-live="polite"
      data-ai-role="processing-placeholder"
      data-ai-intent="indicate-busy"
      data-ai-state="busy"
    >
      <Spinner size="lg" label={spinnerLabel} />
      <p className="cu-processing-placeholder__title">{title}</p>
      {description ? <p className="cu-processing-placeholder__description">{description}</p> : null}
      {thumbnailSrc ? (
        <img
          className="cu-processing-placeholder__thumb"
          src={thumbnailSrc}
          alt={thumbnailAlt}
        />
      ) : null}
      {action ? <div className="cu-processing-placeholder__action">{action}</div> : null}
    </div>
  )
}
