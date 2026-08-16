import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { MindMap } from './MindMap.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const root = {
  id: 'root',
  label: 'Project',
  children: [
    { id: 'a', label: 'Design' },
    { id: 'b', label: 'Build', children: [{ id: 'b1', label: 'Test' }] },
  ],
}

describe('MindMap', () => {
  it('renders every node and connecting edges deterministically', () => {
    render(<MindMap root={root} label="Project map" />)
    const map = screen.getByRole('tree', { name: 'Project map' })
    expect(map).toHaveAttribute('data-ai-role', 'mind-map')
    for (const label of ['Project', 'Design', 'Build', 'Test']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
    expect(map.querySelectorAll('.cu-edge')).toHaveLength(3)
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'mind-map.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<MindMap root={root} label="خريطة" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
