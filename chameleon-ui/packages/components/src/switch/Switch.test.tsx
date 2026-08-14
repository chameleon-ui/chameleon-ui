import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Switch } from './Switch.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Switch', () => {
  it('toggles on click and exposes the hidden checkbox', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Switch checked={false} label="Airplane mode" onChange={onChange} />)
    const input = screen.getByRole('checkbox', { name: 'Airplane mode' })
    expect(input).not.toBeChecked()

    await user.click(screen.getByText('Airplane mode'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(<Switch checked={false} label={copy.get('switch.airplane') ?? ''} onChange={() => undefined} />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('checkbox', { name: 'وضع الطيران' })).toBeInTheDocument()
    expect(createCatalog(de).get('switch.notifications')).toBe('Benachrichtigungen')
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('switch.airplane')).toBe('Airplane mode')
    expect(createCatalog(zhCN).get('switch.notifications')).toBe('通知')
  })
})
