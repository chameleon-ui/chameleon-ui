import type { ReactNode } from 'react'
import './styles.css'

export interface TableColumn<T = unknown> {
  key: string
  header: ReactNode
  render?: (row: T) => ReactNode
}

export interface TableProps<T = unknown> {
  columns: TableColumn<T>[]
  rows: T[]
  getRowId?: (row: T, index: number) => string
  caption?: string
  className?: string
}

export function Table<T>({ columns, rows, getRowId, caption, className }: TableProps<T>) {
  const classes = ['cu-table', className].filter(Boolean).join(' ')

  return (
    <div className={classes} data-ai-role="table" data-ai-intent="inspect-tabular-data" data-ai-state={rows.length === 0 ? 'empty' : 'default'}>
      <table className="cu-table__table">
        {caption ? <caption className="cu-table__caption">{caption}</caption> : null}
        <thead className="cu-table__head">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="cu-table__header" scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="cu-table__body">
          {rows.map((row, index) => (
            <tr key={getRowId ? getRowId(row, index) : index} className="cu-table__row">
              {columns.map((column) => (
                <td key={column.key} className="cu-table__cell">
                  {column.render ? column.render(row) : String((row as Record<string, ReactNode>)[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
