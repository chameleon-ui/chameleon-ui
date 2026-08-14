import { useState } from 'react'
import './styles.css'

export type ShareTarget = 'x' | 'linkedin' | 'email' | 'copy'

export interface SharePanelProps {
  title: string
  url: string
  targets?: ShareTarget[]
  copyLabel?: string
  className?: string
}

const TARGET_LABEL: Record<Exclude<ShareTarget, 'copy'>, string> = {
  x: 'X',
  linkedin: 'LinkedIn',
  email: 'Email',
}

function targetHref(target: Exclude<ShareTarget, 'copy'>, url: string, title: string) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  if (target === 'x') return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  if (target === 'linkedin') return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  return `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
}

export function SharePanel({ title, url, targets = ['x', 'linkedin', 'email', 'copy'], copyLabel = 'Copy link', className }: SharePanelProps) {
  const [copied, setCopied] = useState(false)
  const classes = ['cu-share-panel', className].filter(Boolean).join(' ')

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(url)
    } catch {
      // Clipboard unavailable; still surface the confirmation affordance.
    }
    setCopied(true)
  }

  return (
    <div
      className={classes}
      role="group"
      aria-label={title}
      data-ai-role="share-panel" data-ai-intent="share-content"
      data-ai-state={copied ? 'copied' : 'default'}
    >
      <p className="cu-share-panel__title">{title}</p>
      <div className="cu-share-panel__targets">
        {targets.map((target) =>
          target === 'copy' ? (
            <button key="copy" type="button" className="cu-share-panel__target" onClick={copy}>
              {copied ? '✓ ' : ''}{copyLabel}
            </button>
          ) : (
            <a
              key={target}
              className="cu-share-panel__target"
              href={targetHref(target, url, title)}
              target="_blank"
              rel="noreferrer"
            >
              {TARGET_LABEL[target]}
            </a>
          ),
        )}
      </div>
      <p className="cu-share-panel__url">{url}</p>
    </div>
  )
}
