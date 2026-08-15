export const DAY_MS = 86_400_000
/** 2023-01-01 was a Sunday; anchor for Intl-derived weekday names. */
export const SUNDAY = Date.UTC(2023, 0, 1)

export function parseISODate(value: string | undefined): { year: number; month: number } {
  const parts = value?.split('-').map(Number) ?? []
  const now = new Date()
  return {
    year: parts[0] || now.getUTCFullYear(),
    month: parts[1] ? parts[1] - 1 : now.getUTCMonth(),
  }
}

export function toISODate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
}

/** Locale first day of week normalized to 0 (Sunday) … 6 (Saturday). */
export function firstDayOfWeek(locale: string): number {
  try {
    const info = (new Intl.Locale(locale) as { weekInfo?: { firstDay?: number } }).weekInfo
    return (info?.firstDay ?? 7) % 7
  } catch {
    return 0
  }
}

export function weekdayNames(locale: string, firstDay: number): string[] {
  const format = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })
  return Array.from({ length: 7 }, (_, index) =>
    format.format(new Date(SUNDAY + ((firstDay + index) % 7) * DAY_MS)),
  )
}

export function buildWeeks(year: number, month: number, firstDay: number): (number | null)[][] {
  const leadingBlanks = (new Date(Date.UTC(year, month, 1)).getUTCDay() - firstDay + 7) % 7
  const dayCount = daysInMonth(year, month)
  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: dayCount }, (_, index) => index + 1),
  ]
  const weeks: (number | null)[][] = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }
  return weeks
}
