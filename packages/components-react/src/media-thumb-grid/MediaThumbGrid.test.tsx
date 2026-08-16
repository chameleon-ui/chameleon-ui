import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, requireMessage } from '@chameleon-ui/i18n'
import { MediaThumbGrid } from './MediaThumbGrid.js'
import en from './locales/en.json'

describe('MediaThumbGrid', () => {
  it('toggles selected thumb ids', () => {
    const onSelectedIdsChange = vi.fn()
    render(
      <MediaThumbGrid
        items={[
          { id: '1', src: '/1.png', label: 'Page 1' },
          { id: '2', src: '/2.png', label: 'Page 2' },
        ]}
        selectedIds={['1']}
        onSelectedIdsChange={onSelectedIdsChange}
      />,
    )
    expect(screen.getByRole('group')).toHaveAttribute('data-ai-role', 'media-thumb-grid')
    fireEvent.click(screen.getByRole('button', { name: /Page 2/i }))
    expect(onSelectedIdsChange).toHaveBeenCalledWith(['1', '2'])
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'media-thumb-grid.label')).toBeDefined()
  })
})
