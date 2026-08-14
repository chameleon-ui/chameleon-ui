import { PopoverPrimitive } from '@chameleon-ui/primitives'
import type { ReactNode } from 'react'
import './styles.css'

export interface PopoverProps {
  trigger: ReactNode
  title: string
  description: string
  closeLabel: string
  children?: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Popover({
  trigger,
  title,
  description,
  closeLabel,
  children,
  defaultOpen,
  open,
  onOpenChange,
}: PopoverProps) {
  return (
    <PopoverPrimitive.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={(details) => onOpenChange?.(details.open)}
    >
      <PopoverPrimitive.Trigger asChild className="cu-popover__trigger">
        {trigger}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Positioner className="cu-popover__positioner">
        <PopoverPrimitive.Content
          className="cu-popover__content"
          data-ai-role="popover" data-ai-intent="reveal-context"
          data-ai-state="open"
        >
          <PopoverPrimitive.Title className="cu-popover__title">{title}</PopoverPrimitive.Title>
          <PopoverPrimitive.Description className="cu-popover__description">
            {description}
          </PopoverPrimitive.Description>
          {children ? <div className="cu-popover__body">{children}</div> : null}
          <PopoverPrimitive.CloseTrigger className="cu-popover__close">
            {closeLabel}
          </PopoverPrimitive.CloseTrigger>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Root>
  )
}
