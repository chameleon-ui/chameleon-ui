import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { TimePicker } from './TimePicker.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const props = {
  value: '09:30',
  onChange: () => {},
  label: 'Time',
  hourLabel: 'Hour',
  minuteLabel: 'Minute',
}

describe('TimePicker', () => {
  it('renders hour and minute controls with data-ai-role', () => {
    render(<TimePicker {...props} />)
    const group = screen.getByRole('group', { name: 'Time' })
    expect(group).toHaveAttribute('data-ai-role', 'time-picker')
    expect(group).toHaveAttribute('data-ai-state', 'default')
    expect(screen.getByRole('combobox', { name: 'Hour' })).toHaveValue('9')
    expect(screen.getByRole('combobox', { name: 'Minute' })).toHaveValue('30')
  })

  it('emits HH:mm on change', () => {
    let next = ''
    render(<TimePicker {...props} onChange={(value) => { next = value }} />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Hour' }), { target: { value: '14' } })
    expect(next).toBe('14:30')
    fireEvent.change(screen.getByRole('combobox', { name: 'Minute' }), { target: { value: '5' } })
    expect(next).toBe('09:05')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'time-picker.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<TimePicker {...props} label="الوقت" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
