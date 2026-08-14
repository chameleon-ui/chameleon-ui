import { DialogPrimitive } from '@chameleon-ui/primitives'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { useRef, useState } from 'react'
import './styles.css'

export interface ActionSheetAction {
  value: string
  label: ReactNode
}

export interface ActionSheetProps {
  triggerLabel: string
  title: string
  cancelLabel: string
  actions: ActionSheetAction[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onAction?: (value: string) => void
  className?: string
}

/** Drag distance (px) past which releasing the handle dismisses the sheet. */
const DISMISS_THRESHOLD_PX = 72

export function ActionSheet({
  triggerLabel,
  title,
  cancelLabel,
  actions,
  open,
  onOpenChange,
  onAction,
  className,
}: ActionSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open ?? internalOpen
  const drag = useRef<{ pointerId: number; startY: number; delta: number } | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  function requestOpenChange(next: boolean) {
    if (open === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  function applyDragOffset(delta: number) {
    const content = contentRef.current
    if (!content) return
    content.style.transform = delta > 0 ? `translateY(${delta}px)` : ''
  }

  function onHandlePointerDown(event: ReactPointerEvent<HTMLSpanElement>) {
    drag.current = { pointerId: event.pointerId, startY: event.clientY, delta: 0 }
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      // jsdom has no pointer capture; dragging still works via element handlers.
    }
  }

  function onHandlePointerMove(event: ReactPointerEvent<HTMLSpanElement>) {
    if (drag.current?.pointerId !== event.pointerId) return
    drag.current.delta = Math.max(0, event.clientY - drag.current.startY)
    applyDragOffset(drag.current.delta)
  }

  function onHandlePointerEnd(event: ReactPointerEvent<HTMLSpanElement>) {
    if (drag.current?.pointerId !== event.pointerId) return
    const { delta } = drag.current
    drag.current = null
    applyDragOffset(0)
    if (delta > DISMISS_THRESHOLD_PX) requestOpenChange(false)
  }

  const classes = ['cu-action-sheet', 'cu-action-sheet__content', className].filter(Boolean).join(' ')

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(details) => requestOpenChange(details.open)}>
      <DialogPrimitive.Trigger className="cu-action-sheet__trigger">{triggerLabel}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="cu-action-sheet__backdrop" />
        <DialogPrimitive.Positioner className="cu-action-sheet__positioner">
          <DialogPrimitive.Content
            ref={contentRef}
            className={classes}
            data-ai-role="action-sheet"
            data-ai-intent="choose-action"
            data-ai-state={isOpen ? 'open' : 'closed'}
          >
            <span
              className="cu-action-sheet__handle"
              aria-hidden="true"
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerEnd}
              onPointerCancel={onHandlePointerEnd}
            />
            <DialogPrimitive.Title className="cu-action-sheet__title">{title}</DialogPrimitive.Title>
            <div className="cu-action-sheet__actions">
              {actions.map((action) => (
                <button
                  key={action.value}
                  type="button"
                  className="cu-action-sheet__action"
                  onClick={() => {
                    onAction?.(action.value)
                    requestOpenChange(false)
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
            <DialogPrimitive.CloseTrigger className="cu-action-sheet__cancel">
              {cancelLabel}
            </DialogPrimitive.CloseTrigger>
          </DialogPrimitive.Content>
        </DialogPrimitive.Positioner>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
