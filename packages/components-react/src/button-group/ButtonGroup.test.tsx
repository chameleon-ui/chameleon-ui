import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, requireMessage } from '@chameleon-ui/i18n'
import { Button } from '../button/Button.js'
import { ButtonGroup } from './ButtonGroup.js'
import en from './locales/en.json'

describe('ButtonGroup', () => {
  it('renders an attached horizontal group around Buttons', () => {
    render(
      <ButtonGroup label="Mask tools" size="sm">
        <Button size="sm">Paint</Button>
        <Button size="sm" variant="outline">
          Erase
        </Button>
      </ButtonGroup>,
    )

    const group = screen.getByRole('group', { name: 'Mask tools' })
    expect(group).toHaveClass(
      'cu-button-group',
      'cu-button-group--horizontal',
      'cu-button-group--attached',
      'cu-button-group--sm',
    )
    expect(group).toHaveAttribute('data-ai-role', 'button-group')
    expect(group).toHaveAttribute('data-ai-intent', 'select-single')
    expect(screen.getByRole('button', { name: 'Paint' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Erase' })).toBeInTheDocument()
  })

  it('supports vertical spaced layout', () => {
    render(
      <ButtonGroup orientation="vertical" variant="spaced">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    )

    const group = screen.getByRole('group')
    expect(group).toHaveClass('cu-button-group--vertical', 'cu-button-group--spaced')
    expect(group).toHaveAttribute('data-orientation', 'vertical')
    expect(group).toHaveAttribute('data-variant', 'spaced')
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'button-group.label')).toBeDefined()
  })
})
