import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, requireMessage } from '@chameleon-ui/i18n'
import { ScrollPane } from './ScrollPane.js'
import en from './locales/en.json'

describe('ScrollPane', () => {
  it('renders a scroll host', () => {
    const { container } = render(<ScrollPane>list</ScrollPane>)
    expect(container.firstElementChild).toHaveClass('cu-scroll-pane', 'cu-scroll-pane--vertical')
    expect(container.firstElementChild).toHaveAttribute('data-ai-role', 'scroll-pane')
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'scroll-pane.label')).toBeDefined()
  })
})
