import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Sidebar } from './Sidebar.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

const items = [
  { value: 'home', label: 'Home' },
  { value: 'library', label: 'Library' },
]

describe('Sidebar', () => {
  it('renders with cu-* classes, data-ai-role, and the expanded state', () => {
    render(<Sidebar label="Main" items={items} />)
    const element = document.querySelector('.cu-sidebar')
    expect(element).toHaveClass('cu-sidebar')
    expect(element).toHaveAttribute('data-ai-role', 'sidebar')
    expect(element).toHaveAttribute('data-ai-state', 'expanded')
    expect(screen.getByRole('complementary', { name: 'Main' })).toBeInTheDocument()
  })

  it('marks the active item with aria-current', () => {
    render(<Sidebar label="Main" items={items} activeValue="library" />)
    expect(screen.getByRole('button', { name: 'Library' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('reports selection', () => {
    const onSelect = vi.fn()
    render(<Sidebar label="Main" items={items} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: 'Home' }))
    expect(onSelect).toHaveBeenCalledWith('home')
  })

  it('toggles the collapsed rail with an accessible toggle', () => {
    const onCollapsedChange = vi.fn()
    render(
      <Sidebar
        label="Main"
        items={items}
        collapsible
        collapseLabel="Collapse sidebar"
        expandLabel="Expand sidebar"
        onCollapsedChange={onCollapsedChange}
      />,
    )
    const toggle = screen.getByRole('button', { name: 'Collapse sidebar' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(toggle)
    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    expect(document.querySelector('.cu-sidebar')).toHaveAttribute('data-ai-state', 'collapsed')
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'sidebar.label')).toBeDefined()
    expect(requireMessage(catalog, 'sidebar.collapse')).toBe('Collapse sidebar')
    expect(requireMessage(createCatalog(zhCN), 'sidebar.expand')).toBe('展开侧边栏')
    expect(requireMessage(createCatalog(de), 'sidebar.label')).toBeDefined()
    expect(requireMessage(createCatalog(ar), 'sidebar.label')).toBe('الشريط الجانبي')
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Sidebar label="التنقل" items={items} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
