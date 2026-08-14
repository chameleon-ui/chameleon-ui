import type { ContractDoc, ContractExport, ContractProp } from './contracts'

export function componentName(contract: ContractDoc): string {
  if (contract.name) return contract.name
  return pascalFromSlug(contract.slug ?? 'component')
}

export function pascalFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

export function splitProps(contract: ContractDoc): {
  attrs: Array<[string, ContractProp]>
  events: Array<[string, ContractProp]>
} {
  const entries = Object.entries(contract.props ?? {})
  return {
    attrs: entries.filter(([, spec]) => spec.type !== 'event'),
    events: entries.filter(([, spec]) => spec.type === 'event'),
  }
}

export function inferEventPayload(name: string, spec: ContractProp): string {
  if (spec.payload) return spec.payload
  const lower = name.toLowerCase()
  if (lower === 'onclick' || lower === 'onback' || lower === 'onclose' || lower === 'onpress') {
    return '() => void'
  }
  if (lower === 'onsubmit') return '(event: React.FormEvent<HTMLFormElement>) => void'
  if (lower === 'onopenchange') return '(open: boolean) => void'
  if (lower === 'oncollapsedchange') return '(collapsed: boolean) => void'
  if (lower === 'onchange' || lower === 'onselect' || lower === 'onvaluechange') {
    return '(value: string) => void'
  }
  const description = spec.description?.toLowerCase() ?? ''
  if (description.includes('boolean')) return '(value: boolean) => void'
  if (description.includes('string') || description.includes('value')) return '(value: string) => void'
  return '(...args: unknown[]) => void'
}

export function mechanicsParagraphs(contract: ContractDoc): string[] {
  if (contract.mechanics) return [contract.mechanics]
  const paragraphs: string[] = []
  if (contract.purpose) paragraphs.push(contract.purpose)
  if (contract.responsive?.strategy) paragraphs.push(contract.responsive.strategy)
  const parents = contract.composition?.allowedParents
  if (parents?.length) paragraphs.push(`Legal parents: ${parents.join(', ')}.`)
  const platforms = contract.platforms
  if (platforms) {
    paragraphs.push(
      `Platforms: web ${platforms.web ?? '—'}, React ${platforms.react ?? '—'}, Vue ${platforms.vue ?? '—'}.`,
    )
  }
  return paragraphs
}

export function usageSteps(contract: ContractDoc): string[] {
  if (contract.usage?.length) return contract.usage
  const name = componentName(contract)
  const { attrs, events } = splitProps(contract)
  const required = attrs.filter(([, spec]) => spec.required).map(([prop]) => prop)
  const eventNames = events.map(([prop]) => prop)
  const steps = [
    `Import { ${name} } from '@chameleon-ui/components'. Do not import workspace:* or packages/components/src.`,
  ]
  if (required.length) {
    steps.push(`Pass required props: ${required.join(', ')}.`)
  }
  if (eventNames.length) {
    steps.push(`Wire events: ${eventNames.join(', ')}.`)
  }
  if (contract.scenarios?.length) {
    steps.push(...contract.scenarios)
  }
  return steps
}

function handlerPlaceholder(name: string, spec: ContractProp): string {
  const payload = inferEventPayload(name, spec)
  if (payload.includes('collapsed: boolean')) return 'setCollapsed'
  if (payload.includes('open: boolean')) return 'setOpen'
  if (payload.includes('value: string')) return '(value) => { /* handle */ }'
  if (payload.startsWith('()')) return '() => { /* handle */ }'
  return '(event) => { event.preventDefault() }'
}

export function usageSnippet(contract: ContractDoc): string {
  const name = componentName(contract)
  const { attrs, events } = splitProps(contract)
  const required = attrs.filter(([prop, spec]) => spec.required && prop !== 'children')
  const hasChildren = attrs.some(([prop]) => prop === 'children')
  const lines = [`import { ${name} } from '@chameleon-ui/components'`, '', `<${name}`]
  for (const [prop, spec] of required) {
    if (spec.type === 'boolean') {
      lines.push(`  ${prop}`)
      continue
    }
    lines.push(`  ${prop}={${prop}}`)
  }
  for (const [prop, spec] of events) {
    lines.push(`  ${prop}={${handlerPlaceholder(prop, spec)}}`)
  }
  if (hasChildren) {
    lines.push('>')
    lines.push('  {children}')
    lines.push(`</${name}>`)
  } else {
    lines.push('/>')
  }
  return lines.join('\n')
}

export function listedExports(contract: ContractDoc): ContractExport[] {
  if (contract.exports?.length) return contract.exports
  const name = componentName(contract)
  return [
    {
      name,
      kind: 'component',
      signature: `function ${name}(props: ${name}Props): JSX.Element`,
      description: contract.purpose ?? `${name} component.`,
    },
  ]
}

export function agentRecipe(contract: ContractDoc): string {
  const slug = contract.slug ?? 'component'
  const name = componentName(contract)
  const intent = contract.dataAi?.intents?.[0] ?? slug
  const { attrs, events } = splitProps(contract)
  const required = attrs.filter(([, spec]) => spec.required).map(([prop]) => prop)
  const eventLines = events.map(([prop, spec]) => `  ${prop}: ${inferEventPayload(prop, spec)}`)
  const anti = (contract.antiPatterns ?? []).map((item) => `- ${item}`)
  return [
    `get_contract({ slug: "${slug}" })`,
    `search_components({ intent: "${intent}" })`,
    'get_import_specifiers()',
    'get_design_rules()  // before density / RTL',
    '',
    `import { ${name} } from '@chameleon-ui/components'`,
    '',
    `Required props: ${required.join(', ') || '(none)'}`,
    events.length ? `Events:\n${eventLines.join('\n')}` : 'Events: none (declarative / CSS morph).',
    '',
    `data-ai-role="${contract.dataAi?.role ?? slug}"`,
    contract.dataAi?.states?.length ? `data-ai-state: ${contract.dataAi.states.join(' | ')}` : '',
    contract.dataAi?.intents?.length ? `data-ai-intent: ${contract.dataAi.intents.join(' | ')}` : '',
    '',
    'Do not import workspace:* or packages/components/src.',
    anti.length ? `Do not emit:\n${anti.join('\n')}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}
