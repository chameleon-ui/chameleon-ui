import { TooltipPrimitive } from '@chameleon-ui/primitives'
import type { ReactNode } from 'react'
import './styles.css'

export interface TooltipProps {
  trigger: ReactNode
  content: ReactNode
  openDelay?: number
  closeDelay?: number
  className?: string
}

export function Tooltip({ trigger, content, openDelay = 300, closeDelay = 100, className }: TooltipProps) {
  const classes = ['cu-tooltip', className].filter(Boolean).join(' ')

  return (
    <TooltipPrimitive.Root closeDelay={closeDelay} openDelay={openDelay}>
      <TooltipPrimitive.Trigger asChild className="cu-tooltip__trigger">
        {trigger}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Positioner className="cu-tooltip__positioner">
        <TooltipPrimitive.Content
          className={classes}
          data-ai-role="tooltip" data-ai-intent="explain-on-hover"
          data-ai-state="open"
          role="tooltip"
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Root>
  )
}
