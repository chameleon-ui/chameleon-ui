import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Notification } from './Notification.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('Notification', () => {
  it('renders the status region with data-ai-role', () => {
    render(<Notification title="Sync complete" message="All files uploaded." variant="success" />)
    const element = screen.getByRole('status')
    expect(element).toHaveClass('cu-notification')
    expect(element).toHaveAttribute('data-ai-role', 'notification')
    expect(element).toHaveAttribute('data-ai-state', 'success')
  })

  it('calls onDismiss from the dismiss control', () => {
    let dismissed = 0
    render(
      <Notification title="Sync" message="Done." onDismiss={() => { dismissed += 1 }} dismissLabel="Dismiss" />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(dismissed).toBe(1)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'notification.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Notification title="إشعار" message="نص" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
