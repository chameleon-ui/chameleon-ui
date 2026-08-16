import { useState } from 'react'
import './styles.css'

export interface CalendarProps {
  value?: string
  onSelect?: (isoDate: string) => void
  locale?: string
  label: string
  previousMonthLabel?: string
  nextMonthLabel?: string
  className?: string
}

const DAY_MS = 86_400_000
/** 2023-01-01 was a Sunday; anchor for Intl-derived weekday names. */
const SUNDAY = Date.UTC(2023, 0, 1)

function parseISODate(value: string | undefined): { year: number; month: number } {
  const parts = value?.split('-').map(Number) ?? []
  const now = new Date()
  return {
    year: parts[0] || now.getUTCFullYear(),
    month: parts[1] ? parts[1] - 1 : now.getUTCMonth(),
  }
}

function toISODate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
}

/** Locale first day of week normalized to 0 (Sunday) … 6 (Saturday). */
function firstDayOfWeek(locale: string): number {
  try {
    const info = (new Intl.Locale(locale) as { weekInfo?: { firstDay?: number } }).weekInfo
    return (info?.firstDay ?? 7) % 7
  } catch {
    return 0
  }
}

function weekdayNames(locale: string, firstDay: number): string[] {
  const format = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })
  return Array.from({ length: 7 }, (_, index) => format.format(new Date(SUNDAY + ((firstDay + index) % 7) * DAY_MS)))
}

export function Calendar({
  value,
  onSelect,
  locale = 'en',
  label,
  previousMonthLabel = 'Previous month',
  nextMonthLabel = 'Next month',
  className,
}: CalendarProps) {
  const initial = parseISODate(value)
  const [view, setView] = useState(initial)
  const classes = ['cu-calendar', className].filter(Boolean).join(' ')

  const monthFormat = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const dayFormat = new Intl.NumberFormat(locale)
  const headline = monthFormat.format(new Date(Date.UTC(view.year, view.month, 1)))
  const firstDay = firstDayOfWeek(locale)
  const weekdays = weekdayNames(locale, firstDay)
  const leadingBlanks = (new Date(Date.UTC(view.year, view.month, 1)).getUTCDay() - firstDay + 7) % 7
  const dayCount = daysInMonth(view.year, view.month)
  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: dayCount }, (_, index) => index + 1),
  ]
  const weeks: (number | null)[][] = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }

  const move = (delta: number) => {
    setView((current) => {
      const next = new Date(Date.UTC(current.year, current.month + delta, 1))
      return { year: next.getUTCFullYear(), month: next.getUTCMonth() }
    })
  }

  return (
    <div className={classes} data-ai-role="calendar" data-ai-intent="pick-datetime" data-ai-state="default" aria-label={label}>
      <div className="cu-calendar__header">
        <button type="button" className="cu-calendar__nav" aria-label={previousMonthLabel} onClick={() => move(-1)}>
          <span aria-hidden="true">‹</span>
        </button>
        <span className="cu-calendar__headline">{headline}</span>
        <button type="button" className="cu-calendar__nav" aria-label={nextMonthLabel} onClick={() => move(1)}>
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <div className="cu-calendar__grid" role="grid" aria-label={headline}>
        <div className="cu-calendar__weekdays" role="row">
          {weekdays.map((weekday, index) => (
            <span key={weekday + index} className="cu-calendar__weekday" role="columnheader">
              {weekday}
            </span>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="cu-calendar__week" role="row">
            {week.map((day, dayIndex) =>
              day === null ? (
                <span key={`blank-${weekIndex}-${dayIndex}`} className="cu-calendar__blank" role="gridcell" aria-hidden="true" />
              ) : (
                <span
                  key={day}
                  className="cu-calendar__cell"
                  role="gridcell"
                  aria-selected={value === toISODate(view.year, view.month, day)}
                >
                  <button
                    type="button"
                    className="cu-calendar__day"
                    aria-label={toISODate(view.year, view.month, day)}
                    onClick={() => onSelect?.(toISODate(view.year, view.month, day))}
                  >
                    {dayFormat.format(day)}
                  </button>
                </span>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
