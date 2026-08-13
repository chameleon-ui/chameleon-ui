import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useState } from 'react'
import { Input } from './Input'

describe('Input', () => {
  it('keeps its label association and controlled value contract', async () => {
    const user = userEvent.setup()

    function ControlledInput() {
      const [value, setValue] = useState('')
      return (
        <Input
          errorMessage="Use at least three characters."
          label="Project name"
          value={value}
          onChange={setValue}
          invalid
        />
      )
    }

    render(<ControlledInput />)
    const input = screen.getByRole('textbox', { name: 'Project name' })

    await user.type(input, 'Chameleon')
    expect(input.getAttribute('value')).toBe('Chameleon')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    const error = screen.getByText('Use at least three characters.')
    expect(input.getAttribute('aria-describedby')).toBe(error.id)
  })

  it('forwards the disabled state', () => {
    render(<Input disabled label="Locked project" onChange={() => undefined} value="Read only" />)

    expect(screen.getByRole('textbox', { name: 'Locked project' }).hasAttribute('disabled')).toBe(true)
  })
})
