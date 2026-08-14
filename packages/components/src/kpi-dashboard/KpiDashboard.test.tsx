import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { KpiDashboard } from './KpiDashboard.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const items = [
  { id: 'rev', label: 'Revenue', value: '$12k', trend: 'up' as const },
  { id: 'users', label: 'Active users', value: '1,204' },
]

describe('KpiDashboard', () => {
  it('renders the region with data-ai-role and one tile per item', () => {
    render(<KpiDashboard items={items} label="KPI dashboard" />)
    const region = screen.getByRole('region', { name: 'KPI dashboard' })
    expect(region).toHaveAttribute('data-ai-role', 'kpi-dashboard')
    expect(region).toHaveAttribute('data-ai-state', 'default')
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('1,204')).toBeInTheDocument()
  })

  it('marks an empty item list on data-ai-state', () => {
    render(<KpiDashboard items={[]} label="KPI dashboard" />)
    expect(screen.getByRole('region', { name: 'KPI dashboard' })).toHaveAttribute('data-ai-state', 'empty')
  })

  it('adapts columns with token-equal @container queries, not viewport media', () => {
    const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8')
    expect(css).toMatch(/container-type:\s*inline-size/)
    expect(css).toMatch(/@container \(min-width: 48rem\)/)
    expect(css).toMatch(/@container \(min-width: 80rem\)/)
    expect(css).not.toMatch(/@media\s*\(\s*(?:min|max)-width/)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'kpi-dashboard.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<KpiDashboard items={items} label="لوحة المؤشرات" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
