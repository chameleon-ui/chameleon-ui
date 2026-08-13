import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { getMessages, type Locale } from './demo/i18n'

const locales: Locale[] = ['en', 'en-XA']
const directions = ['ltr', 'rtl'] as const

describe('App full playground matrix', () => {
  for (const locale of locales) {
    for (const direction of directions) {
      it(`covers Button, Input, Dialog, breakpoints, and no telemetry in ${locale}/${direction}`, async () => {
        const user = userEvent.setup()
        const { container } = render(<App />)
        const english = getMessages('en')

        if (locale !== 'en') {
          await user.selectOptions(
            screen.getByRole('combobox', { name: english.controls.locale }),
            locale,
          )
        }

        const messages = getMessages(locale)
        await user.click(
          screen.getByRole('radio', {
            name: direction === 'rtl' ? messages.controls.rtl : messages.controls.ltr,
          }),
        )

        expect(document.documentElement).toHaveAttribute('lang', locale)
        expect(document.documentElement).toHaveAttribute('dir', direction)

        const components = within(container.querySelector('.cu-components') as HTMLElement)
        await user.click(components.getByRole('button', { name: messages.button.solid }))
        await user.click(components.getByRole('button', { name: messages.button.outline }))
        expect(components.getByRole('status')).toHaveTextContent('2')

        const input = components.getByRole('textbox', { name: messages.input.label })
        await user.clear(input)
        await user.type(input, 'ab')
        expect(components.getByText(messages.input.invalid)).toBeInTheDocument()
        await user.type(input, 'c')
        expect(components.queryByText(messages.input.invalid)).not.toBeInTheDocument()

        const trigger = components.getByRole('button', { name: messages.dialog.trigger })
        await user.click(trigger)
        const dialog = await screen.findByRole('dialog', { name: messages.dialog.title })
        expect(getComputedStyle(dialog).direction).toBe(direction)
        await user.keyboard('{Escape}')
        await waitFor(() => {
          expect(screen.queryByRole('dialog', { name: messages.dialog.title })).not.toBeInTheDocument()
          expect(trigger).toHaveFocus()
        })

        const previews = [...container.querySelectorAll('[data-preview-width]')]
        expect(previews.map((node) => node.getAttribute('data-preview-width'))).toEqual([
          '390',
          '768',
          '1280',
        ])
        expect(
          previews.every(
            (node) =>
              node.getAttribute('lang') === locale && node.getAttribute('dir') === direction,
          ),
        ).toBe(true)
        expect(container.querySelector('[data-ai-role]')).toBeNull()
      })
    }
  }
})
