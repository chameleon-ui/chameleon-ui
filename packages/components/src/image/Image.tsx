import { useState } from 'react'
import './styles.css'

export interface ImageProps {
  src: string
  alt: string
  caption?: string
  errorLabel?: string
  className?: string
}

export function Image({ src, alt, caption, errorLabel = 'Image failed to load', className }: ImageProps) {
  const [failed, setFailed] = useState(false)
  const classes = ['cu-image', className].filter(Boolean).join(' ')
  return (
    <figure className={classes} data-ai-role="image" data-ai-intent="signal-meaning" data-ai-state={failed ? 'error' : 'default'}>
      {failed ? (
        <div className="cu-image__fallback" role="img" aria-label={alt}>
          {errorLabel}
        </div>
      ) : (
        <img className="cu-image__img" src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      )}
      {caption ? <figcaption className="cu-image__caption">{caption}</figcaption> : null}
    </figure>
  )
}
