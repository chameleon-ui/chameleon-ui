import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Tooltip } from './Tooltip.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Tooltip', () => {
  it('shows the tooltip on trigger focus', async () => {
    const user = userEvent.setup()

    render(<Tooltip content="More information" openDelay={0} closeDelay={0} trigger={<button type="button">Info</button>} />)
    const trigger = screen.getByRole('button', { name: 'Info' })
    await user.tab()
    expect(trigger).toHaveFocus()

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('More information')
    })
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(
      <Tooltip
        content={copy.get('tooltip.hint') ?? ''}
        openDelay={0}
        trigger={<button type="button">?</button>}
      />,
    )
    expect(document.documentElement.dir).toBe('rtl')
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('tooltip.hint')).toBe('More information')
    expect(createCatalog(de).get('tooltip.shortcut')).toBe('Tastaturkürzel verwenden')
    expect(createCatalog(zhCN).get('tooltip.hint')).toBe('更多信息')
  })
})
