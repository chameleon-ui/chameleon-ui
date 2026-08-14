import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Chart } from './Chart.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const series = [
  { name: 'Revenue', data: [4, 8, 6, 10] },
  { name: 'Cost', data: [2, 5, 3, 7] },
]

describe('Chart', () => {
  it('renders an SVG with data-ai-role and series paint from token classes', () => {
    render(<Chart type="line" series={series} label="Revenue vs cost" />)
    const svg = screen.getByRole('img', { name: 'Revenue vs cost' })
    const figure = svg.closest('.cu-chart')
    expect(figure).toHaveAttribute('data-ai-role', 'chart')
    expect(figure).toHaveAttribute('data-ai-state', 'line')
    expect(svg.querySelectorAll('polyline')).toHaveLength(2)
    expect(svg.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,6}/)
  })

  it('renders bars for the bar type', () => {
    render(<Chart type="bar" series={series} label="Revenue vs cost" />)
    const svg = screen.getByRole('img', { name: 'Revenue vs cost' })
    expect(svg.querySelectorAll('rect')).toHaveLength(8)
  })

  it('shows the empty state without data', () => {
    render(<Chart series={[]} label="Revenue" emptyLabel="No data" />)
    expect(screen.getByText('No data')).toBeInTheDocument()
    expect(screen.getByText('No data').closest('.cu-chart')).toHaveAttribute('data-ai-state', 'empty')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'chart.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Chart series={series} label="مخطط" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
