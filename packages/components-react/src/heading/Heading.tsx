import type { ReactNode } from 'react'
import './styles.css'

export type HeadingLevel = 'level-1' | 'level-2' | 'level-3' | 'level-4' | 'level-5' | 'level-6'

export interface HeadingProps {
  children: ReactNode
  level?: HeadingLevel
  className?: string
}

const tagByLevel: Record<HeadingLevel, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
  'level-1': 'h1',
  'level-2': 'h2',
  'level-3': 'h3',
  'level-4': 'h4',
  'level-5': 'h5',
  'level-6': 'h6',
}

export function Heading({ children, level = 'level-2', className }: HeadingProps) {
  const classes = ['cu-heading', 'cu-heading--' + level, className].filter(Boolean).join(' ')
  const Tag = tagByLevel[level]
  return <Tag className={classes} data-ai-role="heading" data-ai-intent="structure-content" data-ai-state={level}>{children}</Tag>
}
