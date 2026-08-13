import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { translate, type Locale, type TextDirection } from './demo/i18n'

const locales: Locale[] = ['en', 'en-XA']
const directions: TextDirection[] = ['ltr', 'rtl']
const widths = ['390', '768', '1280'] as const

describe('App full playground matrix', () => {
  for (const locale of locales) {
    for (const direction of directions) {
      it(`covers every width, Dialog, show-all, and no telemetry in ${locale}/${direction}`, async () => {
        const user = userEvent.setup()
        const { container } = render(<App />)
        const t = (key: Parameters<typeof translate>[1], parameters?: Record<string, string | number>) =>
          translate(locale, key, parameters)

        if (locale !== 'en') {
          await user.selectOptions(screen.getByRole('combobox', { name: translate('en', 'controls.locale') }), locale)
        }

        await user.click(
          screen.getByRole('radio', {
            name: direction === 'rtl' ? t('controls.rtl') : t('controls.ltr'),
          }),
        )

        expect(document.documentElement.getAttribute('lang')).toBe(locale)
        expect(document.documentElement.getAttribute('dir')).toBe(direction)

        const viewport = screen.getByRole('combobox', { name: t('controls.viewport') })
        for (const width of widths) {
          await user.selectOptions(viewport, width)
          const preview = container.querySelector('[data-preview-width]') as HTMLElement
          expect(preview.getAttribute('data-preview-width')).toBe(width)
          expect(preview.closest('[dir]')?.getAttribute('dir')).toBe(direction)

          const scoped = within(preview)
          const before = scoped.getByRole('status').textContent
          await user.click(scoped.getByRole('button', { name: t('button.primary') }))
          expect(scoped.getByRole('status').textContent).not.toBe(before)

          await user.click(scoped.getByRole('checkbox', { name: t('input.invalid') }))
          expect(preview.querySelector('.cu-field__error')?.textContent).toBe(t('input.invalid'))
          await user.click(scoped.getByRole('checkbox', { name: t('input.invalid') }))
          expect(preview.querySelector('.cu-field__error')).toBeNull()

          const trigger = scoped.getByRole('button', { name: t('dialog.trigger') })
          await user.click(trigger)
          const dialog = await screen.findByRole('dialog', { name: t('dialog.title') })
          expect(getComputedStyle(dialog).direction).toBe(direction)
          await user.keyboard('{Escape}')
          await waitFor(() => {
            expect(screen.queryByRole('dialog', { name: t('dialog.title') })).toBeNull()
            expect(document.activeElement).toBe(trigger)
          })
        }

        await user.click(screen.getByRole('checkbox', { name: t('controls.showAll') }))
        expect(
          [...container.querySelectorAll('[data-preview-width]')].map((node) =>
            node.getAttribute('data-preview-width'),
          ),
        ).toEqual(['390', '768', '1280'])
        expect(container.querySelector('[data-ai-role]')).toBeNull()
      })
    }
  }
})
