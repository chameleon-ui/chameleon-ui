import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Stack } from './Stack.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Stack', () => {
  it('renders a flex container with direction and gap data attributes', () => {
    render(
      <Stack direction="row" gap="3">
        <span>One</span>
        <span>Two</span>
      </Stack>,
    )
    const stack = screen.getByText('One').parentElement

    expect(stack).toHaveClass('cu-stack', 'cu-stack--row', 'cu-stack--gap-3')
    expect(stack).toHaveAttribute('data-ai-role', 'stack')
    expect(stack).toHaveAttribute('data-direction', 'row')
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(
      <Stack>
        <span>{copy.get('stack.label') ?? ''}</span>
      </Stack>,
    )
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByText('تكديس')).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('stack.label')).toBe('Stack')
    expect(createCatalog(de).get('stack.label')).toBe('Anordnung stapeln')
    expect(createCatalog(zhCN).get('stack.label')).toBe('堆叠')
  })
})
