import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('associates its label and maps changes to a string value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<Input label="Project name" onChange={onChange} value="" />)
    const input = screen.getByRole('textbox', { name: 'Project name' })
    await user.type(input, 'A')

    expect(onChange).toHaveBeenCalledWith('A')
  })

  it('exposes invalid and disabled state to the native control', () => {
    render(<Input disabled invalid label="Project name" onChange={() => undefined} value="" />)
    const input = screen.getByRole('textbox', { name: 'Project name' })

    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})
