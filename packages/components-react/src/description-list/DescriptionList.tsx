import './styles.css'

export interface DescriptionListItem {
  term: string
  description: string
}

export interface DescriptionListProps {
  items: DescriptionListItem[]
  className?: string
}

export function DescriptionList({ items, className }: DescriptionListProps) {
  const classes = ['cu-description-list', className].filter(Boolean).join(' ')
  return (
    <dl className={classes} data-ai-role="description-list" data-ai-state="default" data-ai-intent="inspect-details">
      {items.map((item, index) => (
        <div className="cu-description-list__group" key={index}>
          <dt className="cu-description-list__term">{item.term}</dt>
          <dd className="cu-description-list__detail">{item.description}</dd>
        </div>
      ))}
    </dl>
  )
}
