import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Table } from './Table.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

const rows = [
  { name: 'Alice', status: 'Active' },
  { name: 'Bob', status: 'Away' },
]

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status' },
]

describe('Table', () => {
  it('renders a semantic table with headers and rows', () => {
    render(<Table caption="Users" columns={columns} rows={rows} />)
    const table = screen.getByRole('table')

    expect(table).toHaveClass('cu-table__table')
    expect(screen.getByRole('caption')).toHaveTextContent('Users')
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Alice' })).toBeInTheDocument()
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    const arColumns = [
      { key: 'name', header: copy.get('table.name') ?? '' },
      { key: 'status', header: copy.get('table.status') ?? '' },
    ]

    render(<Table caption={copy.get('table.caption') ?? ''} columns={arColumns} rows={rows} />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('columnheader', { name: 'الاسم' })).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('table.caption')).toBe('Data table')
    expect(createCatalog(de).get('table.name')).toBe('Vollständiger Name')
    expect(createCatalog(zhCN).get('table.status')).toBe('状态')
  })
})
