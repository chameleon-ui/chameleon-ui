import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { OtpInput } from './OtpInput.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('OtpInput', () => {
  it('renders a labelled group of cells with data-ai attributes', () => {
    render(<OtpInput label="One-time code" value="" onChange={() => {}} />)
    const group = screen.getByRole('group', { name: 'One-time code' })
    expect(group).toHaveClass('cu-otp-input')
    expect(group).toHaveAttribute('data-ai-role', 'otp-input')
    expect(group).toHaveAttribute('data-ai-state', 'default')
    expect(screen.getAllByRole('textbox')).toHaveLength(6)
  })

  it('writes a digit and advances focus to the next cell', () => {
    let next = ''
    render(<OtpInput label="One-time code" value="" onChange={(value) => { next = value }} digitLabel="Digit" />)
    const first = screen.getByRole('textbox', { name: 'Digit 1' })
    fireEvent.change(first, { target: { value: '5' } })
    expect(next).toBe('5')
    expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveFocus()
  })

  it('rejects non-digit characters', () => {
    let calls = 0
    render(<OtpInput label="One-time code" value="" onChange={() => { calls += 1 }} digitLabel="Digit" />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Digit 1' }), { target: { value: 'x' } })
    expect(calls).toBe(0)
  })

  it('backspace on an empty cell clears and focuses the previous cell', () => {
    let next = '12'
    render(<OtpInput label="One-time code" value="12" onChange={(value) => { next = value }} digitLabel="Digit" />)
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Digit 3' }), { key: 'Backspace' })
    expect(next).toBe('1')
    expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveFocus()
  })

  it('fills from pasted digits and reports the joined code', () => {
    let next = ''
    render(<OtpInput label="One-time code" value="" onChange={(value) => { next = value }} />)
    fireEvent.paste(screen.getByRole('group', { name: 'One-time code' }), {
      clipboardData: { getData: () => '1-2-3-4-5-6' },
    })
    expect(next).toBe('123456')
  })

  it('marks the complete state when all cells are filled', () => {
    render(<OtpInput label="One-time code" value="123456" onChange={() => {}} />)
    expect(screen.getByRole('group', { name: 'One-time code' })).toHaveAttribute('data-ai-state', 'complete')
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'otp-input.digit')).toBeDefined()
    expect(requireMessage(createCatalog(ar), 'otp-input.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<OtpInput label="الرمز" value="" onChange={() => {}} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
