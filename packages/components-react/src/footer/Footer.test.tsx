import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, requireMessage } from '@chameleon-ui/i18n'
import { AppShell } from '../app-shell/AppShell.js'
import { Footer } from './Footer.js'
import en from './locales/en.json'

describe('Footer', () => {
  it('renders a recognizable attribution root', () => {
    render(
      <Footer>
        <span>Credits</span>
      </Footer>,
    )
    const root = document.querySelector('.cu-footer')
    expect(root).toHaveAttribute('data-ai-role', 'footer')
    expect(root).toHaveAttribute('data-ai-intent', 'show-attribution')
    expect(root).toHaveAttribute('data-ai-state', 'default')
    expect(screen.getByText('Credits')).toBeInTheDocument()
  })

  it('is the official AppShell footer child path', () => {
    render(
      <AppShell header={<span>H</span>} footerPlacement="shell" footer={<Footer>Thanks</Footer>}>
        <span>Main</span>
      </AppShell>,
    )
    expect(document.querySelector('.cu-app-shell__footer .cu-footer')).toBeTruthy()
    expect(screen.getByText('Thanks')).toBeInTheDocument()
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'footer.label')).toBeDefined()
  })
})
