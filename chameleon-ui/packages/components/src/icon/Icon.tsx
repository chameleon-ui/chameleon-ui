import type { ReactNode } from 'react'
import './styles.css'

export interface IconProps {
  /** Accessible name for the icon. */
  label: string
  /** RTL behavior for the icon. */
  mode?: 'mirror' | 'preserve' | 'localized'
  /** Optional SVG content; a default arrow is rendered when omitted. */
  children?: ReactNode
  className?: string
}

export function Icon({ label, mode = 'preserve', children, className }: IconProps) {
  const classes = ['cu-icon', `cu-icon--${mode}`, className].filter(Boolean).join(' ')

  return (
    <span
      className={classes}
      data-ai-role="icon" data-ai-intent="signal-meaning"
      data-ai-state="default"
      data-mode={mode}
      aria-label={label}
      role="img"
    >
      {children ?? <DefaultIcon />}
    </span>
  )
}

function DefaultIcon() {
  return (
    <svg aria-hidden="true" className="cu-icon__svg" viewBox="0 0 24 24">
      <path
        d="M20 12H4m0 0l6-6m-6 6l6 6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  )
}
