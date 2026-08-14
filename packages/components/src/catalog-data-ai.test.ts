import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import catalog from '../catalog.json'

const here = path.dirname(fileURLToPath(import.meta.url))
// CU_COMPONENTS_SRC is a red-proof hook used by phase8:gates; never set in production runs.
const srcRoot = process.env.CU_COMPONENTS_SRC ?? here
// Vocabulary always resolves from this test file, not the temp fixture tree.
const vocabulary = JSON.parse(
  readFileSync(path.resolve(here, '../../../../docs/ai/data-ai-vocabulary.json'), 'utf8'),
) as { intents: Record<string, string> }

/** Full catalog gate (catalog v2.0). Isolation n<=50 is retired now that P5/P6 contracts carry intents. */
const gatedComponents = catalog.components

interface ContractDataAi {
  role: string
  states: string[]
  intents: string[]
}

function implementationSource(slug: string): string {
  const dir = path.join(srcRoot, slug)
  const files = readdirSync(dir, { recursive: true, encoding: 'utf8' })
  const parts: string[] = []
  for (const relative of files) {
    const normalized = relative.replaceAll('\\', '/')
    if (!/\.(tsx|ts)$/.test(normalized)) continue
    if (/\.test\./.test(normalized) || normalized.startsWith('locales/')) continue
    parts.push(readFileSync(path.join(dir, relative), 'utf8'))
  }
  return parts.join('\n')
}

function contractDataAi(slug: string): ContractDataAi {
  const contract = JSON.parse(
    readFileSync(path.join(srcRoot, slug, 'contract.json'), 'utf8'),
  ) as { dataAi: ContractDataAi }
  return contract.dataAi
}

/**
 * Phase 8 A5 full-catalog gate (replaces the Phase 3 MVP20 spot-check):
 * every catalog component must carry the data-ai-role + data-ai-state +
 * data-ai-intent triple, and the declared role/intent must match contract.json.
 */
describe('A5 catalog-wide data-ai attributes', () => {
  it('puts data-ai-role, data-ai-state and data-ai-intent on every catalog component', () => {
    const missing: string[] = []
    for (const component of gatedComponents) {
      const source = implementationSource(component.slug)
      if (!source.includes('data-ai-role')) missing.push(`${component.slug}: data-ai-role`)
      if (!source.includes('data-ai-state')) missing.push(`${component.slug}: data-ai-state`)
      if (!source.includes('data-ai-intent')) missing.push(`${component.slug}: data-ai-intent`)
    }
    expect(missing, missing.join('; ')).toEqual([])
  })

  it('keeps DOM data-ai-role literals aligned with contract dataAi.role', () => {
    const drifted: string[] = []
    for (const component of gatedComponents) {
      const source = implementationSource(component.slug)
      const { role } = contractDataAi(component.slug)
      if (!source.includes(`data-ai-role="${role}"`)) {
        drifted.push(`${component.slug}: contract role "${role}" not found in DOM attributes`)
      }
    }
    expect(drifted, drifted.join('; ')).toEqual([])
  })

  it('keeps DOM data-ai-intent literals inside contract dataAi.intents', () => {
    const drifted: string[] = []
    const intentPattern = /data-ai-intent="([^"]+)"/g
    for (const component of gatedComponents) {
      const source = implementationSource(component.slug)
      const { intents } = contractDataAi(component.slug)
      for (const match of source.matchAll(intentPattern)) {
        if (!intents.includes(match[1])) {
          drifted.push(`${component.slug}: data-ai-intent "${match[1]}" not in contract intents`)
        }
      }
    }
    expect(drifted, drifted.join('; ')).toEqual([])
  })

  it('registers every contract intent in the published vocabulary', () => {
    const unregistered: string[] = []
    for (const component of gatedComponents) {
      const { intents } = contractDataAi(component.slug)
      for (const intent of intents) {
        if (!Object.hasOwn(vocabulary.intents, intent)) {
          unregistered.push(`${component.slug}: intent "${intent}" not in docs/ai/data-ai-vocabulary.json`)
        }
      }
    }
    expect(unregistered, unregistered.join('; ')).toEqual([])
  })
})
