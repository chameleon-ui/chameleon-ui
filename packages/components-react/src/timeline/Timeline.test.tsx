import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Timeline } from './Timeline.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Timeline', () => {
  it('renders items in order with data-ai-role', () => {
    render(
      <Timeline
        items={[
          { id: '1', title: 'Created', time: '09:00' },
          { id: '2', title: 'Shipped', time: '12:00' },
        ]}
      />,
    )
    const element = screen.getByText('Created').closest('.cu-timeline')
    expect(element).toHaveAttribute('data-ai-role', 'timeline')
    expect(element).toHaveAttribute('data-ai-state', 'default')
    const titles = screen.getAllByRole('listitem').map((item) => item.textContent)
    expect(titles[0]).toContain('Created')
    expect(titles[1]).toContain('Shipped')
  })

  it('shows the empty state', () => {
    render(<Timeline items={[]} emptyLabel="No events yet" />)
    expect(screen.getByText('No events yet')).toBeInTheDocument()
    expect(screen.getByText('No events yet').closest('.cu-timeline')).toHaveAttribute('data-ai-state', 'empty')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'timeline.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Timeline items={[{ id: '1', title: 'حدث' }]} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
