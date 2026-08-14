import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Popover } from './Popover.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Popover', () => {
  it('opens from the trigger and has a dialog role', async () => {
    const user = userEvent.setup()
    const copy = createCatalog(en)

    render(
      <Popover
        closeLabel={copy.get('popover.close') ?? ''}
        description="Filter the list."
        title="Filters"
        trigger={<button type="button">Open</button>}
      >
        <button type="button">Apply</button>
      </Popover>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Filters' })).toHaveAttribute('data-ai-role', 'popover')
    })
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(
      <Popover
        closeLabel={copy.get('popover.close') ?? ''}
        description="تصفية القائمة."
        title={copy.get('popover.filters') ?? ''}
        trigger={<button type="button">فتح</button>}
      />,
    )
    expect(document.documentElement.dir).toBe('rtl')
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('popover.filters')).toBe('Filters')
    expect(createCatalog(de).get('popover.close')).toBe('Schließen')
    expect(createCatalog(zhCN).get('popover.filters')).toBe('筛选')
  })
})
