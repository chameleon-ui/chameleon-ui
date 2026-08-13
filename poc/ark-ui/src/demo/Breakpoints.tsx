import type { CSSProperties } from 'react'
import type { Direction } from '../App'
import { Button } from '../components/button'
import { Dialog } from '../components/dialog'
import { Input } from '../components/input'
import type { Locale, Messages } from './i18n'

const targets = [390, 768, 1280] as const

interface BreakpointsProps {
  direction: Direction
  locale: Locale
  messages: Messages
}

export function Breakpoints({ direction, locale, messages }: BreakpointsProps) {
  return (
    <section aria-labelledby="breakpoints-title" className="cu-panel">
      <p className="cu-kicker">390 · 768 · 1280</p>
      <h2 id="breakpoints-title">{messages.breakpoints.title}</h2>
      <p>{messages.breakpoints.description}</p>
      <div className="cu-breakpoint-list">
        {targets.map((target) => (
          <article
            aria-label={`${messages.breakpoints.viewport}: ${target}px`}
            className="cu-breakpoint-preview"
            data-preview-width={target}
            dir={direction}
            key={target}
            lang={locale}
            style={{ '--cu-preview-width': `${target}px` } as CSSProperties}
          >
            <header className="cu-breakpoint-preview__header">
              <span>{messages.breakpoints.viewport}</span>
              <strong>{target}px</strong>
            </header>
            <div className="cu-breakpoint-preview__surface">
              <Button size="sm">{messages.button.solid}</Button>
              <Input
                label={messages.input.label}
                onChange={() => undefined}
                placeholder={messages.input.placeholder}
                value=""
              />
              <Dialog
                closeLabel={messages.dialog.close}
                description={messages.dialog.description}
                title={messages.dialog.title}
                triggerLabel={messages.dialog.trigger}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
