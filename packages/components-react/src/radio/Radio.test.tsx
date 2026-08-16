import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Radio } from './Radio.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

const options = [
  { value: 'card', label: 'Credit card' },
  { value: 'bank', label: 'Bank transfer' },
]

describe('Radio', () => {
  it('selects an option and calls onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Radio label="Payment" onChange={onChange} options={options} value="" />)
    const first = screen.getByRole('radio', { name: 'Credit card' })

    await user.click(first)
    expect(onChange).toHaveBeenCalledWith('card')
    expect(first).toBeChecked()
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    const arOptions = [
      { value: 'card', label: copy.get('radio.optionCard') ?? '' },
      { value: 'bank', label: copy.get('radio.optionBank') ?? '' },
    ]

    render(<Radio label={copy.get('radio.payment') ?? ''} onChange={() => undefined} options={arOptions} value="" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('radio', { name: 'بطاقة ائتمان' })).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('radio.payment')).toBe('Payment method')
    expect(createCatalog(de).get('radio.optionBank')).toBe('Zahlung per Banküberweisung')
    expect(createCatalog(zhCN).get('radio.optionCard')).toBe('信用卡')
  })
})
