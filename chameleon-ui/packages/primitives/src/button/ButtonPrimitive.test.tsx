import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ButtonPrimitive } from './ButtonPrimitive.js'

describe('ButtonPrimitive', () => {
  it('renders a native button and activates from the keyboard', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<ButtonPrimitive onClick={onClick}>Save</ButtonPrimitive>)
    const button = screen.getByRole('button', { name: 'Save' })

    await user.tab()
    expect(button).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
