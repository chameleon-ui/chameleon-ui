import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { PasswordInput } from './PasswordInput.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('PasswordInput', () => {
  it('renders masked with cu-* classes and data-ai attributes', () => {
    render(<PasswordInput label="Password" value="s3cret" onChange={() => {}} showLabel="Show password" hideLabel="Hide password" />)
    const input = screen.getByLabelText('Password')
    const element = input.closest('.cu-password-input')
    expect(element).toHaveClass('cu-password-input')
    expect(element).toHaveAttribute('data-ai-role', 'password-input')
    expect(element).toHaveAttribute('data-ai-state', 'default')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('reveals and conceals the value via the toggle', () => {
    render(<PasswordInput label="Password" value="s3cret" onChange={() => {}} showLabel="Show password" hideLabel="Hide password" />)
    const toggle = screen.getByRole('button', { name: 'Show password' })
    fireEvent.click(toggle)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByLabelText('Password').closest('.cu-password-input')).toHaveAttribute('data-ai-state', 'revealed')
  })

  it('reports edits and marks invalid state', () => {
    let next = ''
    render(<PasswordInput label="Password" value="" onChange={(value) => { next = value }} showLabel="Show" hideLabel="Hide" invalid />)
    const input = screen.getByLabelText('Password')
    fireEvent.change(input, { target: { value: 'a' } })
    expect(next).toBe('a')
    expect(input.closest('.cu-password-input')).toHaveAttribute('data-ai-state', 'invalid')
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'password-input.show')).toBeDefined()
    expect(requireMessage(createCatalog(ar), 'password-input.hide')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<PasswordInput label="كلمة المرور" value="" onChange={() => {}} showLabel="إظهار" hideLabel="إخفاء" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
