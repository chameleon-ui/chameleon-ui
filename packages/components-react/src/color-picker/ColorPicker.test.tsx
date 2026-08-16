import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { ColorPicker, normalizeHex } from './ColorPicker.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('ColorPicker', () => {
  it('renders swatches as a listbox with data-ai-role', () => {
    render(<ColorPicker value="#2563eb" onChange={() => {}} label="Color" />)
    const picker = screen.getByRole('listbox', { name: 'Color' }).closest('.cu-color-picker')
    expect(picker).toHaveAttribute('data-ai-role', 'color-picker')
    expect(picker).toHaveAttribute('data-ai-state', 'default')
    expect(screen.getByRole('option', { name: '#2563eb' })).toHaveAttribute('aria-selected', 'true')
  })

  it('selects a swatch and accepts typed hex values', () => {
    let next = ''
    render(<ColorPicker value="#2563eb" onChange={(value) => { next = value }} label="Color" hexLabel="Hex value" />)
    fireEvent.click(screen.getByRole('option', { name: '#dc2626' }))
    expect(next).toBe('#dc2626')
    const input = screen.getByLabelText('Hex value')
    fireEvent.change(input, { target: { value: '16a34a' } })
    fireEvent.blur(input)
    expect(next).toBe('#16a34a')
  })

  it('rejects invalid hex input', () => {
    let next = ''
    render(<ColorPicker value="#2563eb" onChange={(value) => { next = value }} label="Color" hexLabel="Hex value" />)
    const input = screen.getByLabelText('Hex value')
    fireEvent.change(input, { target: { value: 'not-a-color' } })
    fireEvent.blur(input)
    expect(next).toBe('')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(normalizeHex('#FFF')).toBeNull()
    expect(normalizeHex('a1b2c3')).toBe('#a1b2c3')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'color-picker.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<ColorPicker value="#2563eb" onChange={() => {}} label="اللون" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
