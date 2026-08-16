import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Textarea } from './Textarea.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Textarea', () => {
  it('associates its label and maps changes to a string value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Textarea label="Message" onChange={onChange} value="" />)
    const textarea = screen.getByRole('textbox', { name: 'Message' })
    await user.type(textarea, 'A')

    expect(onChange).toHaveBeenCalledWith('A')
    expect(textarea).toHaveClass('cu-textarea')
  })

  it('exposes invalid and disabled state to the native control', () => {
    render(
      <Textarea
        disabled
        errorMessage={createCatalog(en).get('textarea.invalid')}
        invalid
        label="Message"
        onChange={() => undefined}
        value=""
      />,
    )
    const textarea = screen.getByRole('textbox', { name: 'Message' })

    expect(textarea).toBeDisabled()
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Please enter at least ten characters.')).toBeInTheDocument()
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(
      <Textarea
        label={copy.get('textarea.label') ?? ''}
        onChange={() => undefined}
        value=""
      />,
    )
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('textbox', { name: 'رسالة' })).toBeInTheDocument()
    expect(createCatalog(de).get('textarea.label')).toBe('Ihre Nachricht')
  })
})
