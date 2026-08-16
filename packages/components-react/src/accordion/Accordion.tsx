import { useState } from 'react'
import './styles.css'

export interface AccordionItem {
  title: string
  content: string
}

export interface AccordionProps {
  items: AccordionItem[]
  multiple?: boolean
  className?: string
}

export function Accordion({ items, multiple = false, className }: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set())
  const classes = ['cu-accordion', className].filter(Boolean).join(' ')

  const toggle = (index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        if (!multiple) next.clear()
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className={classes} data-ai-role="accordion" data-ai-intent="expand-section" data-ai-state={openIndexes.size > 0 ? 'open' : 'closed'}>
      {items.map((item, index) => {
        const open = openIndexes.has(index)
        return (
          <div className="cu-accordion__item" key={index}>
            <button
              className="cu-accordion__trigger"
              onClick={() => toggle(index)}
              type="button"
              aria-expanded={open}
            >
              {item.title}
            </button>
            {open ? <div className="cu-accordion__content">{item.content}</div> : null}
          </div>
        )
      })}
    </div>
  )
}
