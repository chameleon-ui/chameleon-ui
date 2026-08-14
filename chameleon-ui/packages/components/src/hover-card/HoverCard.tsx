import { PopoverPrimitive } from '@chameleon-ui/primitives'
import { useState } from 'react'
import type { ReactNode } from 'react'
import './styles.css'

export interface HoverCardProps {
  trigger: ReactNode
  children: ReactNode
  className?: string
}

export function HoverCard({ trigger, children, className }: HoverCardProps) {
  const [open, setOpen] = useState(false)
  const classes = ['cu-hover-card', className].filter(Boolean).join(' ')

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
    >
      <PopoverPrimitive.Trigger
        asChild
        className="cu-hover-card__trigger"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {trigger}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Positioner>
        <PopoverPrimitive.Content
          className={classes}
          data-ai-role="hover-card" data-ai-intent="preview-detail"
          data-ai-state={open ? 'open' : 'closed'}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Root>
  )
}
