import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Steps } from './Steps.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

const items = [
  { value: 'account', label: 'Account' },
  { value: 'plan', label: 'Plan' },
  { value: 'pay', label: 'Pay' },
]

describe('Steps', () => {
  it('marks the current step and overall data-ai-state', () => {
    render(<Steps label="Checkout" items={items} currentValue="plan" />)
    const nav = screen.getByRole('navigation', { name: 'Checkout' })
    expect(nav).toHaveAttribute('data-ai-role', 'steps')
    expect(nav).toHaveAttribute('data-ai-intent', 'enumerate-items')
    expect(nav).toHaveAttribute('data-ai-state', 'in-progress')
    expect(screen.getByText('Plan').closest('[aria-current="step"]')).not.toBeNull()
  })

  it('notifies onSelect when a step button is activated', () => {
    let selected = ''
    render(
      <Steps
        label="Checkout"
        items={items}
        currentValue="account"
        onSelect={(value) => { selected = value }}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /Pay/ }))
    expect(selected).toBe('pay')
  })

  it('adapts layout with token-equal @container queries, not viewport media', () => {
    const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8')
    expect(css).toMatch(/container-type:\s*inline-size/)
    expect(css).toMatch(/@container \(min-width: 48rem\)/)
    expect(css).toMatch(/@container \(min-width: 80rem\)/)
    expect(css).not.toMatch(/@media\s*\(\s*(?:min|max)-width/)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'steps.label')).toBeDefined()
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)
    render(
      <Steps
        label={copy.get('steps.label') ?? ''}
        items={[{ value: 'one', label: copy.get('steps.label') ?? '' }]}
        currentValue="one"
      />,
    )
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('navigation', { name: 'خطوات' })).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('steps.label')).toBe('Steps')
    expect(createCatalog(de).get('steps.label')).toBe('Schrittfolge')
    expect(createCatalog(zhCN).get('steps.label')).toBe('步骤')
  })
})
