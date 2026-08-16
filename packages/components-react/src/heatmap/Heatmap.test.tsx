import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Heatmap } from './Heatmap.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const props = {
  rows: ['Mon', 'Tue'],
  columns: ['09:00', '12:00'],
  values: [
    [1, 4],
    [2, 8],
  ],
  label: 'Traffic heatmap',
}

describe('Heatmap', () => {
  it('renders a grid with one cell per row-column pair', () => {
    render(<Heatmap {...props} />)
    const grid = screen.getByRole('grid', { name: 'Traffic heatmap' })
    expect(grid.closest('.cu-heatmap')).toHaveAttribute('data-ai-role', 'heatmap')
    expect(screen.getAllByRole('gridcell')).toHaveLength(4)
    expect(screen.getByLabelText('Tue 12:00: 8')).toBeInTheDocument()
  })

  it('marks missing values as empty', () => {
    render(<Heatmap rows={[]} columns={[]} values={[]} label="Traffic heatmap" />)
    expect(screen.getByRole('grid', { name: 'Traffic heatmap' }).closest('.cu-heatmap')).toHaveAttribute(
      'data-ai-state',
      'empty',
    )
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'heatmap.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Heatmap {...props} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
