import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { DataGrid, computeWindow } from './DataGrid.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const columns = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
]

const rows = Array.from({ length: 10_000 }, (_, index) => ({ id: index, name: `Row ${index}` }))

describe('DataGrid', () => {
  it('renders only a window of 10k rows', () => {
    render(<DataGrid columns={columns} rows={rows} label="Logs" height={360} rowHeight={36} />)
    const grid = screen.getByRole('grid', { name: 'Logs' })
    expect(grid).toHaveAttribute('aria-rowcount', '10001')
    expect(grid.closest('.cu-data-grid')).toHaveAttribute('data-ai-role', 'data-grid')
    // ~10 viewport rows + overscan + header, never 10k DOM rows.
    const rendered = screen.getAllByRole('row').length
    expect(rendered).toBeLessThan(40)
    expect(screen.getByText('Row 0')).toBeInTheDocument()
    expect(screen.queryByText('Row 5000')).toBeNull()
  })

  it('scrolls the window to later rows', () => {
    render(<DataGrid columns={columns} rows={rows} label="Logs" height={360} rowHeight={36} />)
    const viewport = document.querySelector('.cu-data-grid__viewport') as HTMLElement
    viewport.scrollTop = 36 * 500
    fireEvent.scroll(viewport)
    expect(screen.getByText('Row 500')).toBeInTheDocument()
    expect(screen.queryByText('Row 0')).toBeNull()
    const row = screen.getByText('Row 500').closest('[role="row"]')
    expect(row).toHaveAttribute('aria-rowindex', '502')
  })

  it('computes clamped windows', () => {
    expect(computeWindow(0, 360, 10_000, 36, 6)).toEqual({ start: 0, end: 16 })
    expect(computeWindow(36 * 500, 360, 10_000, 36, 6)).toEqual({ start: 494, end: 516 })
    expect(computeWindow(36 * 9999, 360, 10_000, 36, 6)).toEqual({ start: 9993, end: 10_000 })
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'data-grid.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<DataGrid columns={columns} rows={rows.slice(0, 5)} label="السجلات" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
