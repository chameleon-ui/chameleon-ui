import type { ReactNode } from 'react'
import './styles.css'

export type TypographyVariant = 'heading-1' | 'heading-2' | 'body' | 'caption'

export interface TypographyProps {
  variant?: TypographyVariant
  /** Semantic element to render; defaults from the variant if omitted. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  children: ReactNode
  className?: string
}

const defaultElement: Record<TypographyVariant, 'h1' | 'h2' | 'p' | 'span'> = {
  'heading-1': 'h1',
  'heading-2': 'h2',
  body: 'p',
  caption: 'span',
}

export function Typography({ variant = 'body', as, children, className }: TypographyProps) {
  const Element = as ?? defaultElement[variant]
  const classes = ['cu-typography', `cu-typography--${variant}`, className].filter(Boolean).join(' ')

  return (
    <Element className={classes} data-ai-role="typography" data-ai-intent="style-text" data-ai-state={variant} data-variant={variant}>
      {children}
    </Element>
  )
}
