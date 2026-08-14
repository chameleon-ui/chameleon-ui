import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ToastPrimitive } from './ToastPrimitive.js'

describe('ToastPrimitive', () => {
  it('creates and displays a toast via a toaster store', async () => {
    const user = userEvent.setup()
    const toaster = ToastPrimitive.createToaster({ placement: 'bottom-end', overlap: true })

    function Fixture() {
      return (
        <ToastPrimitive.Toaster toaster={toaster}>
          {(toast) => (
            <ToastPrimitive.Root>
              <ToastPrimitive.Title>{toast.title}</ToastPrimitive.Title>
              <ToastPrimitive.Description>{toast.description}</ToastPrimitive.Description>
              <ToastPrimitive.CloseTrigger>Close</ToastPrimitive.CloseTrigger>
            </ToastPrimitive.Root>
          )}
        </ToastPrimitive.Toaster>
      )
    }

    render(<Fixture />)
    toaster.create({ title: 'Saved', description: 'Your changes were saved.' })

    await waitFor(() => {
      expect(screen.getByRole('status', { name: 'Saved' })).toHaveTextContent('Your changes were saved.')
    })

    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    await waitFor(() => {
      expect(screen.getByRole('status', { name: 'Saved' })).toHaveAttribute('data-state', 'closed')
    })
  })
})
