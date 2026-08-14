import { ToastPrimitive } from '@chameleon-ui/primitives'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from 'react'
import './styles.css'

export type ToastStatus = 'info' | 'success' | 'warning' | 'error'
export type ToastPlacement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'

export interface ToastProps {
  open: boolean
  title: string
  description: ReactNode
  status?: ToastStatus
  closeLabel: string
  /** Milliseconds before auto-close. 0 keeps the toast until the parent closes it. */
  duration?: number
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function Toast({
  open,
  title,
  description,
  status = 'info',
  closeLabel,
  duration = 0,
  onOpenChange,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!open || duration <= 0) return
    const timer = window.setTimeout(() => onOpenChange?.(false), duration)
    return () => window.clearTimeout(timer)
  }, [open, duration, onOpenChange])

  if (!open) return null

  const classes = ['cu-toast', `cu-toast--${status}`, className].filter(Boolean).join(' ')

  return (
    <div
      aria-label={title}
      className={classes}
      data-ai-role="toast"
      data-ai-intent="notify-transient"
      data-ai-state={status}
      role="status"
      aria-live={status === 'error' ? 'assertive' : 'polite'}
    >
      <div className="cu-toast__title">{title}</div>
      <div className="cu-toast__description">{description}</div>
      <button className="cu-toast__close" onClick={() => onOpenChange?.(false)} type="button">
        {closeLabel}
      </button>
    </div>
  )
}

export const createToaster = ToastPrimitive.createToaster

export type ToasterStore = ComponentProps<typeof ToastPrimitive.Toaster>['toaster']

export interface ToasterProps {
  toaster: ToasterStore
  closeLabel?: string
  className?: string
}

export function Toaster({ toaster, closeLabel = 'Close', className }: ToasterProps) {
  return (
    <ToastPrimitive.Toaster className={['cu-toaster', className].filter(Boolean).join(' ')} toaster={toaster}>
      {(toast) => {
        const status = normalizeStatus(toast.type)
        return (
          <ToastPrimitive.Root
            className={['cu-toast', `cu-toast--${status}`].join(' ')}
            data-ai-role="toast"
            data-ai-intent="notify-transient"
            data-ai-state={status}
          >
            <ToastPrimitive.Title className="cu-toast__title">{toast.title}</ToastPrimitive.Title>
            {toast.description ? (
              <ToastPrimitive.Description className="cu-toast__description">
                {toast.description}
              </ToastPrimitive.Description>
            ) : null}
            <ToastPrimitive.CloseTrigger aria-label={closeLabel} className="cu-toast__close">
              {closeLabel}
            </ToastPrimitive.CloseTrigger>
          </ToastPrimitive.Root>
        )
      }}
    </ToastPrimitive.Toaster>
  )
}

export interface ToastProviderProps {
  children: ReactNode
  duration?: number
  placement?: ToastPlacement
  closeLabel?: string
}

const ToastStoreContext = createContext<ToasterStore | null>(null)

export function ToastProvider({
  children,
  duration = 4000,
  placement = 'bottom-end',
  closeLabel = 'Close',
}: ToastProviderProps) {
  const toaster = useMemo(
    () => ToastPrimitive.createToaster({ placement, duration, overlap: true }) as ToasterStore,
    [placement, duration],
  )

  return (
    <ToastStoreContext.Provider value={toaster}>
      {children}
      <Toaster closeLabel={closeLabel} toaster={toaster} />
    </ToastStoreContext.Provider>
  )
}

export interface ToastPushInput {
  title: string
  description?: string
  status?: ToastStatus
  duration?: number
}

export function useToast() {
  const toaster = useContext(ToastStoreContext)
  if (!toaster) {
    throw new Error('useToast() requires <ToastProvider> in the tree.')
  }

  return {
    push(input: ToastPushInput) {
      return toaster.create({
        title: input.title,
        description: input.description,
        type: input.status ?? 'info',
        duration: input.duration,
      })
    },
    dismiss(id?: string) {
      const store = toaster as ToasterStore & { remove?: (id?: string) => void }
      store.remove?.(id)
    },
  }
}

function normalizeStatus(value: unknown): ToastStatus {
  if (value === 'success' || value === 'warning' || value === 'error' || value === 'info') {
    return value
  }
  return 'info'
}
