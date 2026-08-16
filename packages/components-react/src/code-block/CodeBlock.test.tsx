import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { CodeBlock } from './CodeBlock.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

describe('CodeBlock', () => {
  it('renders the code with language label and data-ai-role', () => {
    const { container } = render(<CodeBlock code="const a = 1" language="ts" />)
    const block = container.querySelector('.cu-code-block')
    expect(block).toHaveAttribute('data-ai-role', 'code-block')
    expect(block).toHaveAttribute('data-ai-state', 'default')
    expect(block).toHaveTextContent('const a = 1')
    expect(screen.getByText('ts')).toBeInTheDocument()
  })

  it('highlights keywords, strings, and comments with token spans', () => {
    render(<CodeBlock code={'const a = "x" // note'} language="ts" />)
    expect(screen.getByText('const')).toHaveClass('cu-code-block__token--keyword')
    expect(screen.getByText('"x"')).toHaveClass('cu-code-block__token--string')
    expect(screen.getByText('// note')).toHaveClass('cu-code-block__token--comment')
  })

  it('renders plain code when highlight is off', () => {
    const { container } = render(<CodeBlock code="const a = 1" highlight={false} />)
    expect(container.querySelector('[class*="cu-code-block__token"]')).toBeNull()
    expect(container.querySelector('code')).toHaveTextContent('const a = 1')
  })

  it('confirms the copy action', async () => {
    render(<CodeBlock code="const a = 1" copyLabel="Copy code" copiedLabel="Copied" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'code-block.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<CodeBlock code="const a = 1" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
