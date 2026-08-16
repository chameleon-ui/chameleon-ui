import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Calendar } from './Calendar.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const augustHeadline = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
  new Date(Date.UTC(2026, 7, 1)),
)

describe('Calendar', () => {
  it('renders with cu-* classes, data-ai attributes and an Intl headline', () => {
    render(<Calendar label="Schedule" value="2026-08-15" />)
    const element = screen.getByText(augustHeadline).closest('.cu-calendar')
    expect(element).toHaveClass('cu-calendar')
    expect(element).toHaveAttribute('data-ai-role', 'calendar')
    expect(element).toHaveAttribute('data-ai-state', 'default')
    expect(screen.getAllByRole('columnheader')).toHaveLength(7)
  })

  it('selects a day and reports the ISO date', () => {
    let picked = ''
    render(<Calendar label="Schedule" value="2026-08-15" onSelect={(iso) => { picked = iso }} />)
    fireEvent.click(screen.getByRole('button', { name: '2026-08-20' }))
    expect(picked).toBe('2026-08-20')
  })

  it('navigates to the previous month via the labelled control', () => {
    render(<Calendar label="Schedule" value="2026-08-15" />)
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
    const julyHeadline = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(Date.UTC(2026, 6, 1)),
    )
    expect(screen.getByText(julyHeadline)).toBeInTheDocument()
  })

  it('derives weekday names from Intl for ar', () => {
    render(<Calendar label="الجدول" value="2026-08-15" locale="ar" />)
    const friday = new Intl.DateTimeFormat('ar', { weekday: 'short', timeZone: 'UTC' }).format(
      new Date(Date.UTC(2023, 0, 6)),
    )
    expect(screen.getAllByRole('columnheader').map((cell) => cell.textContent)).toContain(friday)
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'calendar.label')).toBeDefined()
    expect(requireMessage(createCatalog(ar), 'calendar.previousMonth')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Calendar label="التقويم" value="2026-08-15" locale="ar" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
