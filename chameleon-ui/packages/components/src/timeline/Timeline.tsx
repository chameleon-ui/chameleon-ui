import './styles.css'

export interface TimelineItem {
  id: string
  title: string
  description?: string
  time?: string
}

export interface TimelineProps {
  items: TimelineItem[]
  emptyLabel?: string
  className?: string
}

export function Timeline({ items, emptyLabel = 'No events yet', className }: TimelineProps) {
  const classes = ['cu-timeline', className].filter(Boolean).join(' ')
  return (
    <div className={classes} data-ai-role="timeline" data-ai-intent="enumerate-items" data-ai-state={items.length === 0 ? 'empty' : 'default'}>
      {items.length === 0 ? (
        <p className="cu-timeline__empty">{emptyLabel}</p>
      ) : (
        <ol className="cu-timeline__list">
          {items.map((item) => (
            <li key={item.id} className="cu-timeline__item">
              <span className="cu-timeline__marker" aria-hidden="true" />
              <div className="cu-timeline__content">
                <span className="cu-timeline__title">{item.title}</span>
                {item.time ? <time className="cu-timeline__time">{item.time}</time> : null}
                {item.description ? <p className="cu-timeline__description">{item.description}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
