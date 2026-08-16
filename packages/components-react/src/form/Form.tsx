import { Button } from '../button/Button.js'
import type { FormEvent, ReactNode } from 'react'
import './styles.css'

export interface FormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  submitLabel: string
  /** Accessible name for the form landmark. Defaults to submitLabel context. */
  label?: string
  children: ReactNode
  className?: string
}

export function Form({ onSubmit, submitLabel, label, children, className }: FormProps) {
  const classes = ['cu-form', className].filter(Boolean).join(' ')

  return (
    <form
      className={classes}
      aria-label={label ?? submitLabel}
      data-ai-role="form"
      data-ai-intent="submit-data"
      data-ai-state="default"
      onSubmit={onSubmit}
    >
      {children}
      <div className="cu-form__actions">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
