import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { CommandPalette, filterCommands } from './CommandPalette.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

const commands = [
  { value: 'zoom', label: 'Zoom', shortcut: '⌘+' },
  { value: 'copy', label: 'Copy' },
  { value: 'open', label: 'Open file' },
]

describe('filterCommands', () => {
  it('sorts by English localeCompare on label then value', () => {
    expect(filterCommands(commands, '').map((item) => item.value)).toEqual(['copy', 'open', 'zoom'])
  })

  it('filters by label or value without changing the sort rule', () => {
    expect(filterCommands(commands, 'zo').map((item) => item.value)).toEqual(['zoom'])
    expect(filterCommands(commands, 'OPEN').map((item) => item.value)).toEqual(['open'])
  })
})

describe('CommandPalette', () => {
  it('renders a closed marker when open is false', () => {
    const { container } = render(
      <CommandPalette open={false} commands={commands} onSelect={() => {}} label="Command palette" />,
    )
    const root = container.querySelector('.cu-command-palette')
    expect(root).toHaveAttribute('data-ai-role', 'command-palette')
    expect(root).toHaveAttribute('data-ai-state', 'closed')
    expect(root).toHaveAttribute('hidden')
  })

  it('lists sorted commands and runs the active option', () => {
    let selected = ''
    render(
      <CommandPalette
        open
        commands={commands}
        onSelect={(value) => { selected = value }}
        label="Command palette"
      />,
    )
    const dialog = screen.getByRole('dialog', { name: 'Command palette' })
    expect(dialog.closest('.cu-command-palette')).toHaveAttribute('data-ai-state', 'open')
    const options = screen.getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual(['Copy', 'Open file', 'Zoom⌘+'])
    fireEvent.click(screen.getByRole('option', { name: 'Copy' }))
    expect(selected).toBe('copy')
  })

  it('filters from the combobox and moves the active option with arrows', () => {
    let selected = ''
    render(
      <CommandPalette
        open
        commands={commands}
        onSelect={(value) => { selected = value }}
        label="Command palette"
      />,
    )
    const input = screen.getByRole('combobox', { name: 'Command palette' })
    fireEvent.change(input, { target: { value: 'o' } })
    expect(input.closest('.cu-command-palette')).toHaveAttribute('data-ai-state', 'filtered')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(selected).toBe('open')
  })

  it('adapts overlay geometry with token-equal @container queries, not viewport media', () => {
    const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'styles.css'), 'utf8')
    expect(css).toMatch(/container-type:\s*inline-size/)
    expect(css).toMatch(/@container \(min-width: 48rem\)/)
    expect(css).toMatch(/@container \(min-width: 80rem\)/)
    expect(css).not.toMatch(/@media\s*\(\s*(?:min|max)-width/)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'command-palette.label')).toBeDefined()
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)
    render(
      <CommandPalette
        open
        commands={commands}
        onSelect={() => {}}
        label={copy.get('command-palette.label') ?? ''}
      />,
    )
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('dialog', { name: 'لوحة الأوامر' })).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('command-palette.label')).toBe('Command palette')
    expect(createCatalog(de).get('command-palette.label')).toBe('Befehlspalette durchsuchen')
    expect(createCatalog(zhCN).get('command-palette.label')).toBe('命令面板')
  })
})
