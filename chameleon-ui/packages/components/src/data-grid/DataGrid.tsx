import { useState } from 'react'
import type { ReactNode } from 'react'
import './styles.css'

export interface DataGridColumn<T = unknown> {
  key: string
  header: ReactNode
  width?: number
  render?: (row: T) => ReactNode
}

export interface DataGridProps<T = unknown> {
  columns: DataGridColumn<T>[]
  rows: T[]
  rowHeight?: number
  height?: number
  width?: number
  overscan?: number
  label: string
  emptyLabel?: string
  getRowId?: (row: T, index: number) => string
  className?: string
}

export interface VirtualWindow {
  start: number
  end: number
}

/**
 * @complexity time O(1) | space O(1) — window edges from scroll offset only
 * @guarantees rendered row/column count stays O(viewport) regardless of data size
 */
export function computeWindow(offset: number, viewport: number, count: number, size: number, overscan: number): VirtualWindow {
  const start = Math.max(0, Math.floor(offset / size) - overscan)
  const end = Math.min(count, Math.ceil((offset + viewport) / size) + overscan)
  return { start, end }
}

const DEFAULT_COLUMN_WIDTH = 160

export function DataGrid<T>({
  columns,
  rows,
  rowHeight = 36,
  height = 420,
  width = 960,
  overscan = 6,
  label,
  emptyLabel = 'No data',
  getRowId,
  className,
}: DataGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const classes = ['cu-data-grid', className].filter(Boolean).join(' ')

  const rowWindow = computeWindow(scrollTop, height, rows.length, rowHeight, overscan)
  const columnWidths = columns.map((column) => column.width ?? DEFAULT_COLUMN_WIDTH)
  const columnOffsets: number[] = []
  let running = 0
  for (const columnWidth of columnWidths) {
    columnOffsets.push(running)
    running += columnWidth
  }
  const totalWidth = running
  const columnWindow = computeWindow(scrollLeft, width, columns.length, DEFAULT_COLUMN_WIDTH, 2)

  return (
    <div className={classes} data-ai-role="data-grid" data-ai-intent="inspect-tabular-data" data-ai-state={rows.length === 0 ? 'empty' : 'default'}>
      <div
        className="cu-data-grid__viewport"
        role="grid"
        aria-label={label}
        aria-rowcount={rows.length + 1}
        aria-colcount={columns.length}
        style={{ blockSize: height, inlineSize: '100%', maxInlineSize: width }}
        onScroll={(event) => {
          setScrollTop(event.currentTarget.scrollTop)
          setScrollLeft(event.currentTarget.scrollLeft)
        }}
      >
        {rows.length === 0 ? (
          <p className="cu-data-grid__empty">{emptyLabel}</p>
        ) : (
          <div
            className="cu-data-grid__canvas"
            style={{ blockSize: (rows.length + 1) * rowHeight, inlineSize: totalWidth }}
          >
            <div
              className="cu-data-grid__row cu-data-grid__row--head"
              role="row"
              aria-rowindex={1}
              style={{ transform: `translateY(${scrollTop}px)` }}
            >
              {columns.slice(columnWindow.start, columnWindow.end).map((column, offsetIndex) => {
                const columnIndex = columnWindow.start + offsetIndex
                return (
                  <div
                    key={column.key}
                    className="cu-data-grid__cell cu-data-grid__cell--head"
                    role="columnheader"
                    aria-colindex={columnIndex + 1}
                    style={{ insetInlineStart: columnOffsets[columnIndex], inlineSize: columnWidths[columnIndex] }}
                  >
                    {column.header}
                  </div>
                )
              })}
            </div>
            {rows.slice(rowWindow.start, rowWindow.end).map((row, offsetIndex) => {
              const rowIndex = rowWindow.start + offsetIndex
              return (
                <div
                  key={getRowId ? getRowId(row, rowIndex) : rowIndex}
                  className="cu-data-grid__row"
                  role="row"
                  aria-rowindex={rowIndex + 2}
                  style={{ transform: `translateY(${(rowIndex + 1) * rowHeight}px)`, blockSize: rowHeight }}
                >
                  {columns.slice(columnWindow.start, columnWindow.end).map((column, offset) => {
                    const columnIndex = columnWindow.start + offset
                    return (
                      <div
                        key={column.key}
                        className="cu-data-grid__cell"
                        role="gridcell"
                        aria-colindex={columnIndex + 1}
                        style={{ insetInlineStart: columnOffsets[columnIndex], inlineSize: columnWidths[columnIndex] }}
                      >
                        {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '')}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
