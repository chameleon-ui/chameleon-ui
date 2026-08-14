import { describe, expect, it } from 'vitest'
import {
  agentRecipe,
  inferEventPayload,
  splitProps,
  usageSnippet,
  usageSteps,
} from './contract-docs'
import type { ContractDoc } from './contracts'

const sample: ContractDoc = {
  slug: 'input',
  name: 'Input',
  purpose: 'Collects a single line of text.',
  props: {
    value: { type: 'string', required: true, description: 'Controlled text value.' },
    onChange: {
      type: 'event',
      required: true,
      description: 'Receives the next string value.',
      payload: '(value: string) => void',
    },
    label: { type: 'string', required: true, description: 'Visible name.' },
  },
  antiPatterns: ['Do not use a placeholder as the only label.'],
  dataAi: { role: 'input', states: ['default'], intents: ['enter-text'] },
}

describe('contract-docs helpers', () => {
  it('splits event props out of the attribute table', () => {
    const { attrs, events } = splitProps(sample)
    expect(attrs.map(([name]) => name)).toEqual(['value', 'label'])
    expect(events.map(([name]) => name)).toEqual(['onChange'])
  })

  it('prefers explicit event payload signatures', () => {
    expect(inferEventPayload('onChange', sample.props!.onChange)).toBe('(value: string) => void')
    expect(inferEventPayload('onBack', { type: 'event', required: false, description: 'Pop.' })).toBe(
      '() => void',
    )
  })

  it('builds a copyable usage snippet from required props and events', () => {
    const code = usageSnippet(sample)
    expect(code).toContain("import { Input } from '@chameleon-ui/components'")
    expect(code).toContain('value={value}')
    expect(code).toContain('onChange={(value) => { /* handle */ }}')
  })

  it('synthesizes usage steps and an agent MCP recipe', () => {
    expect(usageSteps(sample)[0]).toMatch(/@chameleon-ui\/components/)
    const recipe = agentRecipe(sample)
    expect(recipe).toContain('get_contract({ slug: "input" })')
    expect(recipe).toContain('search_components({ intent: "enter-text" })')
    expect(recipe).toContain('Do not use a placeholder as the only label.')
  })
})
