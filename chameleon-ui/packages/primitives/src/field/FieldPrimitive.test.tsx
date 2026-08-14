import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FieldPrimitive } from './FieldPrimitive.js'

describe('FieldPrimitive', () => {
  it('associates the label and reports invalid state', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <FieldPrimitive.Root invalid>
        <FieldPrimitive.Label>Project name</FieldPrimitive.Label>
        <FieldPrimitive.Input onChange={(event) => onChange(event.currentTarget.value)} />
        <FieldPrimitive.ErrorText>Required</FieldPrimitive.ErrorText>
      </FieldPrimitive.Root>,
    )

    const input = screen.getByRole('textbox', { name: 'Project name' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Required')).toBeInTheDocument()
    await user.type(input, 'A')
    expect(onChange).toHaveBeenCalledWith('A')
  })
})
