import { useState } from 'react'
import type { ReactNode } from 'react'
import './styles.css'

export interface CollapseProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function Collapse({ title, children, defaultOpen = false, className }: CollapseProps) {
  const [open, setOpen] = useState(defaultOpen)
  const classes = ['cu-collapse', className].filter(Boolean).join(' ')
  return (
    <div className={classes} data-ai-role="collapse" data-ai-intent="toggle-visibility" data-ai-state={open ? 'open' : 'closed'}>
      <button className="cu-collapse__trigger" onClick={() => setOpen(!open)} type="button" aria-expanded={open}>
        {title}
      </button>
      {open ? <div className="cu-collapse__content">{children}</div> : null}
    </div>
  )
}
