import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Input } from './Input.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'

describe('Input', () => {
  it('associates its label and maps changes to a string value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Input label="Project name" onChange={onChange} value="" />)
    const input = screen.getByRole('textbox', { name: 'Project name' })
    await user.type(input, 'A')

    expect(onChange).toHaveBeenCalledWith('A')
    expect(input).toHaveClass('cu-input')
  })

  it('exposes invalid and disabled state to the native control', () => {
    render(
      <Input
        disabled
        errorMessage={createCatalog(en).get('input.invalid')}
        invalid
        label="Project name"
        onChange={() => undefined}
        value=""
      />,
    )
    const input = screen.getByRole('textbox', { name: 'Project name' })

    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Use at least three characters.')).toBeInTheDocument()
  })

  it('keeps Arabic copy and rtl direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(
      <Input
        label={createCatalog(ar).get('input.label') ?? ''}
        onChange={() => undefined}
        value=""
      />,
    )
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('textbox', { name: 'اسم المشروع' })).toBeInTheDocument()
    expect(createCatalog(de).get('input.label')).toBe('Name des Projektplans')
  })
})
