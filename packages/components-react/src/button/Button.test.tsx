import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  createCatalog,
  directionForLocale,
  formatMessage,
  requireMessage,
} from '@chameleon-ui/i18n'
import { Button } from './Button.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Button', () => {
  it('activates with keyboard input and exposes cu-* classes', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })

    expect(button).toHaveClass('cu-button', 'cu-button--solid', 'cu-button--md')
    expect(button).toHaveAttribute('data-ai-role', 'button')
    expect(button).toHaveAttribute('data-ai-state', 'default')
    await user.tab()
    expect(button).toHaveFocus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('blocks activation while loading and exposes a busy state', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveAttribute('data-ai-state', 'loading')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toBeDisabled()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies danger tone and ghost variant classes', () => {
    render(
      <Button tone="danger" variant="ghost">
        Delete
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Delete' })
    expect(button).toHaveClass('cu-button--ghost', 'cu-button--tone-danger')
    expect(button).toHaveAttribute('data-tone', 'danger')
  })

  it('renders a leading icon without replacing the accessible name', () => {
    render(
      <Button icon={<span data-testid="lead">★</span>}>Save</Button>,
    )
    expect(screen.getByTestId('lead')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('formats ICU plural copy from bundled locales', () => {
    const catalog = createCatalog(en)
    expect(formatMessage('en', requireMessage(catalog, 'button.count'), { count: 0 })).toBe(
      'No actions completed',
    )
    expect(formatMessage('zh-CN', createCatalog(zhCN).get('button.count') ?? '', { count: 2 })).toMatch(
      /2/,
    )
    expect(createCatalog(de).get('button.submit')).toBe('Jetzt absenden')
    expect(createCatalog(ar).get('button.cancel')).toBe('إلغاء')
  })

  it('inherits RTL from language without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Button>إرسال</Button>)
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('button')).not.toHaveAttribute('dir', 'ltr')
  })
})
