import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Form } from './Form.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Form', () => {
  it('submits when the submit button is activated', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event) => event.preventDefault())

    render(
      <Form onSubmit={onSubmit} submitLabel="Send">
        <input name="email" type="text" />
      </Form>,
    )

    const submitButton = screen.getByRole('button', { name: 'Send' })
    await user.click(submitButton)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(submitButton.closest('form')).toHaveAttribute('data-ai-role', 'form')
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(
      <Form onSubmit={() => undefined} submitLabel={copy.get('form.submit') ?? ''}>
        <span>Field</span>
      </Form>,
    )
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('button', { name: 'إرسال' })).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('form.submit')).toBe('Submit')
    expect(createCatalog(de).get('form.required')).toBe('Dies ist ein Pflichtfeld')
    expect(createCatalog(zhCN).get('form.submit')).toBe('提交')
  })
})
