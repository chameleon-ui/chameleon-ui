import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Toast, ToastProvider, useToast } from './Toast.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Toast', () => {
  it('displays a toast when open and closes when asked', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <Toast closeLabel="Close" description="Changes saved" open title="Saved" />,
    )

    const toast = screen.getByRole('status', { name: 'Saved' })
    expect(toast).toHaveClass('cu-toast', 'cu-toast--info')
    expect(toast).toHaveTextContent('Changes saved')

    await user.click(screen.getByRole('button', { name: 'Close' }))

    rerender(<Toast closeLabel="Close" description="Changes saved" open={false} title="Saved" />)
    expect(screen.queryByRole('status', { name: 'Saved' })).not.toBeInTheDocument()
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(
      <Toast
        closeLabel={copy.get('toast.close') ?? ''}
        description={copy.get('toast.savedDescription') ?? ''}
        open
        title={copy.get('toast.saved') ?? ''}
      />,
    )
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('status', { name: 'تم الحفظ' })).toHaveTextContent('تم حفظ التغييرات.')
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('toast.saved')).toBe('Saved')
    expect(createCatalog(de).get('toast.savedDescription')).toBe('Ihre Änderungen wurden gespeichert.')
    expect(createCatalog(zhCN).get('toast.close')).toBe('关闭')
  })

  it('auto-dismisses after duration', () => {
    vi.useFakeTimers()
    const onOpenChange = vi.fn()
    render(
      <Toast
        closeLabel="Close"
        description="Changes saved"
        duration={1000}
        onOpenChange={onOpenChange}
        open
        title="Saved"
      />,
    )
    vi.advanceTimersByTime(1000)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    vi.useRealTimers()
  })

  it('queues toasts through ToastProvider', async () => {
    const user = userEvent.setup()

    function Fixture() {
      const toast = useToast()
      return (
        <button onClick={() => toast.push({ title: 'Queued', description: 'From the provider.', status: 'success' })} type="button">
          Notify
        </button>
      )
    }

    render(
      <ToastProvider closeLabel="Close" duration={0}>
        <Fixture />
      </ToastProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Notify' }))
    expect(await screen.findByText('Queued')).toBeInTheDocument()
    expect(screen.getByText('From the provider.')).toBeInTheDocument()
  })
})
