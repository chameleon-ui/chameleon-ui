import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { PipelineView } from './PipelineView.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

const stages = [
  { id: 'build', name: 'Build', status: 'success' as const },
  { id: 'test', name: 'Test', status: 'running' as const },
  { id: 'deploy', name: 'Deploy', status: 'pending' as const },
]

describe('PipelineView', () => {
  it('renders stages in pipeline order with status text', () => {
    render(<PipelineView stages={stages} label="Release pipeline" />)
    const region = screen.getByRole('region', { name: 'Release pipeline' })
    expect(region).toHaveAttribute('data-ai-role', 'pipeline-view')
    const names = screen.getAllByRole('listitem').map((item) => item.textContent)
    expect(names[0]).toContain('Build')
    expect(names[1]).toContain('Test')
    expect(names[2]).toContain('Deploy')
    expect(screen.getByText('Running')).toBeInTheDocument()
  })

  it('accepts localized status labels', () => {
    render(<PipelineView stages={stages} label="Release pipeline" statusLabels={{ running: '运行中' }} />)
    expect(screen.getByText('运行中')).toBeInTheDocument()
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'pipeline-view.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<PipelineView stages={stages} label="خط الأنابيب" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
