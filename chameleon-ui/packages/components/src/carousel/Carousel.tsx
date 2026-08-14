import { useState } from 'react'
import type { ReactNode } from 'react'
import './styles.css'

export interface CarouselProps {
  items: ReactNode[]
  label: string
  previousLabel: string
  nextLabel: string
  className?: string
}

export function Carousel({ items, label, previousLabel, nextLabel, className }: CarouselProps) {
  const [index, setIndex] = useState(0)
  const classes = ['cu-carousel', className].filter(Boolean).join(' ')
  const count = items.length

  const move = (delta: number) => {
    setIndex((current) => (count === 0 ? 0 : (current + delta + count) % count))
  }

  return (
    <section
      className={classes}
      aria-roledescription="carousel"
      aria-label={label}
      data-ai-role="carousel" data-ai-intent="switch-view"
      data-ai-state={count === 0 ? 'empty' : 'default'}
    >
      <div className="cu-carousel__viewport" aria-roledescription="slide">
        {count > 0 ? items[index] : null}
      </div>
      {count > 1 ? (
        <div className="cu-carousel__controls">
          <button type="button" className="cu-carousel__control" aria-label={previousLabel} onClick={() => move(-1)}>
            <span aria-hidden="true">‹</span>
          </button>
          <span className="cu-carousel__position">
            {index + 1} / {count}
          </span>
          <button type="button" className="cu-carousel__control" aria-label={nextLabel} onClick={() => move(1)}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      ) : null}
    </section>
  )
}
