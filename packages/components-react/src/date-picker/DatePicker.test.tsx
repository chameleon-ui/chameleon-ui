import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { DatePicker } from './DatePicker.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const expectedDisplay = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(
  new Date('2026-08-15T00:00:00Z'),
)

describe('DatePicker', () => {
  it('renders closed with cu-* classes, data-ai attributes and an Intl-formatted value', () => {
    render(<DatePicker label="Delivery date" value="2026-08-15" onChange={() => {}} />)
    const input = screen.getByRole('combobox', { name: 'Delivery date' })
    const element = input.closest('.cu-date-picker')
    expect(element).toHaveClass('cu-date-picker')
    expect(element).toHaveAttribute('data-ai-role', 'date-picker')
    expect(element).toHaveAttribute('data-ai-state', 'closed')
    expect(input).toHaveValue(expectedDisplay)
  })

  it('opens the grid, picks a day, closes and returns focus to the input', () => {
    let picked = ''
    render(<DatePicker label="Delivery date" value="2026-08-15" onChange={(iso) => { picked = iso }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Delivery date' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Delivery date' }).closest('.cu-date-picker')).toHaveAttribute(
      'data-ai-state',
      'open',
    )
    fireEvent.click(screen.getByRole('button', { name: '2026-08-20' }))
    expect(picked).toBe('2026-08-20')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Delivery date' })).toHaveFocus()
  })

  it('closes on Escape without changing the value', () => {
    render(<DatePicker label="Delivery date" value="2026-08-15" onChange={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Delivery date' }))
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('navigates months with the labelled controls', () => {
    render(<DatePicker label="Delivery date" value="2026-08-15" onChange={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Delivery date' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
    const september = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(Date.UTC(2026, 8, 1)),
    )
    expect(screen.getAllByText(september).length).toBeGreaterThan(0)
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'date-picker.label')).toBeDefined()
    expect(requireMessage(createCatalog(ar), 'date-picker.nextMonth')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<DatePicker label="تاريخ التسليم" value="2026-08-15" locale="ar" onChange={() => {}} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
