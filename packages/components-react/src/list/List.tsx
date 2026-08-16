import './styles.css'

export interface ListProps {
  items: string[]
  variant?: 'unordered' | 'ordered' | 'none'
  className?: string
}

export function List({ items, variant = 'unordered', className }: ListProps) {
  const classes = ['cu-list', 'cu-list--' + variant, className].filter(Boolean).join(' ')
  const Tag = variant === 'ordered' ? 'ol' : 'ul'
  return (
    <Tag className={classes} data-ai-role="list" data-ai-intent="enumerate-items" data-ai-state={variant}>
      {items.map((item, index) => <li className="cu-list__item" key={index}>{item}</li>)}
    </Tag>
  )
}
