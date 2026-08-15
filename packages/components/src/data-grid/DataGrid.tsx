import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  computeVariableWindow,
  computeWindow,
  prefixOffsets,
  useRafScroll,
  windowsEqual,
  type VirtualWindow,
} from '../virtual/index.js'
import './styles.css'

export type { VirtualWindow }
export { computeWindow, computeVariableWindow }

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

export interface GridWindow {
  row: VirtualWindow
  column: VirtualWindow
}

const DEFAULT_COLUMN_WIDTH = 160
const COLUMN_OVERSCAN = 2

function gridWindowsEqual(a: GridWindow, b: GridWindow): boolean {
  return windowsEqual(a.row, b.row) && windowsEqual(a.column, b.column)
}

function readGridWindow(
  node: HTMLElement,
  rowCount: number,
  rowHeight: number,
  overscan: number,
  columnWidths: number[],
  fallbackHeight: number,
  fallbackWidth: number,
): GridWindow {
  const viewportHeight = node.clientHeight || fallbackHeight
  const viewportWidth = node.clientWidth || fallbackWidth
  return {
    row: computeWindow(node.scrollTop, viewportHeight, rowCount, rowHeight, overscan),
    column: computeVariableWindow(node.scrollLeft, viewportWidth, columnWidths, COLUMN_OVERSCAN),
  }
}

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
  const classes = ['cu-data-grid', className].filter(Boolean).join(' ')
  const columnWidths = useMemo(
    () => columns.map((column) => column.width ?? DEFAULT_COLUMN_WIDTH),
    [columns],
  )
  const { offsets: columnOffsets, total: totalWidth } = useMemo(
    () => prefixOffsets(columnWidths),
    [columnWidths],
  )
  const [gridWindow, setGridWindow] = useState<GridWindow>(() => ({
    row: computeWindow(0, height, rows.length, rowHeight, overscan),
    column: computeVariableWindow(0, width, columnWidths, COLUMN_OVERSCAN),
  }))

  const onFrame = useCallback(
    (node: HTMLElement) => {
      const next = readGridWindow(node, rows.length, rowHeight, overscan, columnWidths, height, width)
      setGridWindow((prev) => (gridWindowsEqual(prev, next) ? prev : next))
    },
    [columnWidths, height, overscan, rowHeight, rows.length, width],
  )
  const viewportRef = useRafScroll(onFrame)

  const rowWindow = gridWindow.row
  const columnWindow = gridWindow.column

  return (
    <div
      className={classes}
      data-ai-role="data-grid"
      data-ai-intent="inspect-tabular-data"
      data-ai-state={rows.length === 0 ? 'empty' : 'default'}
    >
      <div
        ref={viewportRef}
        className="cu-data-grid__viewport"
        role="grid"
        tabIndex={0}
        aria-label={label}
        aria-rowcount={rows.length + 1}
        aria-colcount={columns.length}
        style={{ blockSize: height, inlineSize: '100%', maxInlineSize: width }}
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
              style={{ blockSize: rowHeight, inlineSize: totalWidth }}
            >
              {columns.slice(columnWindow.start, columnWindow.end).map((column, offsetIndex) => {
                const columnIndex = columnWindow.start + offsetIndex
                return (
                  <div
                    key={column.key}
                    className="cu-data-grid__cell cu-data-grid__cell--head"
                    role="columnheader"
                    aria-colindex={columnIndex + 1}
                    style={{
                      insetInlineStart: columnOffsets[columnIndex],
                      inlineSize: columnWidths[columnIndex],
                    }}
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
                  style={{
                    transform: `translateY(${(rowIndex + 1) * rowHeight}px)`,
                    blockSize: rowHeight,
                  }}
                >
                  {columns.slice(columnWindow.start, columnWindow.end).map((column, offset) => {
                    const columnIndex = columnWindow.start + offset
                    return (
                      <div
                        key={column.key}
                        className="cu-data-grid__cell"
                        role="gridcell"
                        aria-colindex={columnIndex + 1}
                        style={{
                          insetInlineStart: columnOffsets[columnIndex],
                          inlineSize: columnWidths[columnIndex],
                        }}
                      >
                        {column.render
                          ? column.render(row)
                          : String((row as Record<string, unknown>)[column.key] ?? '')}
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
