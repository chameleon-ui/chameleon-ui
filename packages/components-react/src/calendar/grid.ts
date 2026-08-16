/** Intl-backed month-grid helpers shared by Calendar and DatePicker. All math is UTC to stay DST-proof. */

export interface MonthGridDay {
  iso: string
  day: number
  inMonth: boolean
}

export function parseIsoDate(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  if (month < 0 || month > 11 || day < 1 || day > 31) return null
  return { year, month, day }
}

export function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function firstDayOfWeek(locale: string): number {
  try {
    const info = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo?: { firstDay: number }
      getWeekInfo?: () => { firstDay: number }
    }
    return info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay ?? 1
  } catch {
    return 1
  }
}

/** Returns 6 fixed weeks x 7 days covering the month; days outside the month are included for grid stability. */
export function buildMonthGrid(year: number, month: number, weekStartsOn: number): MonthGridDay[][] {
  const startDay = weekStartsOn % 7
  const firstWeekday = new Date(Date.UTC(year, month, 1, 12)).getUTCDay()
  const back = (firstWeekday - startDay + 7) % 7
  const start = new Date(Date.UTC(year, month, 1 - back, 12))
  const weeks: MonthGridDay[][] = []
  for (let week = 0; week < 6; week += 1) {
    const row: MonthGridDay[] = []
    for (let weekday = 0; weekday < 7; weekday += 1) {
      const cell = new Date(start.getTime() + (week * 7 + weekday) * 86_400_000)
      row.push({
        iso: toIsoDate(cell.getUTCFullYear(), cell.getUTCMonth(), cell.getUTCDate()),
        day: cell.getUTCDate(),
        inMonth: cell.getUTCMonth() === month,
      })
    }
    weeks.push(row)
  }
  return weeks
}

export function monthLabel(year: number, month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month, 1, 12)),
  )
}

export function weekdayNames(locale: string, weekStartsOn: number): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })
  const sunday = Date.UTC(2023, 9, 1, 12)
  const names = Array.from({ length: 7 }, (_, index) => formatter.format(new Date(sunday + index * 86_400_000)))
  const rotate = weekStartsOn % 7
  return names.slice(rotate).concat(names.slice(0, rotate))
}

export function formatDateDisplay(iso: string, locale: string): string {
  const parsed = parseIsoDate(iso)
  if (!parsed) return iso
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(Date.UTC(parsed.year, parsed.month, parsed.day, 12)),
  )
}
