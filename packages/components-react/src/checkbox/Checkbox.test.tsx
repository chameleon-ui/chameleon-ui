import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Checkbox } from './Checkbox.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Checkbox', () => {
  it('toggles checked state and exposes the hidden checkbox', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Checkbox checked={false} label="Subscribe" onChange={onChange} />)
    const checkbox = screen.getByRole('checkbox', { name: 'Subscribe' })
    expect(checkbox).not.toBeChecked()

    await user.click(screen.getByText('Subscribe'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(<Checkbox checked={false} label={copy.get('checkbox.agree') ?? ''} onChange={() => undefined} />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('checkbox', { name: 'أوافق على الشروط' })).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('checkbox.subscribe')).toBe('Subscribe to updates')
    expect(createCatalog(de).get('checkbox.agree')).toBe('Ich stimme den Bedingungen zu')
    expect(createCatalog(zhCN).get('checkbox.subscribe')).toBe('订阅更新')
  })
})
