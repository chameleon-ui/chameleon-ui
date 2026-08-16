import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, requireMessage } from '@chameleon-ui/i18n'
import { ProcessingPlaceholder } from './ProcessingPlaceholder.js'
import en from './locales/en.json'

describe('ProcessingPlaceholder', () => {
  it('renders spinner, title, and optional thumbnail', () => {
    render(
      <ProcessingPlaceholder
        title="Processing"
        description="Please wait"
        thumbnailSrc="/original.png"
        thumbnailAlt="Original"
      />,
    )
    expect(screen.getByRole('status', { name: 'Processing' })).toBeTruthy()
    expect(screen.getByText('Please wait')).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Original' })).toHaveClass('cu-processing-placeholder__thumb')
    expect(document.querySelector('[data-ai-role="processing-placeholder"]')).not.toBeNull()
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'processing-placeholder.label')).toBeDefined()
  })
})
