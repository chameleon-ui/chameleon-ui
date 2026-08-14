import { CONTRACTS } from './generated/contracts'

/**
 * Contract SSOT loader.
 *
 * Every component's `contract.json` is the single source of truth for its docs
 * (props / variants / states / a11y / responsive / rtl / antiPatterns).
 * `scripts/generate-component-mdx.mjs` bundles all contracts into
 * `src/generated/contracts.ts` at collect/build time so the MDX pages never
 * hand-duplicate props. Change a contract, regenerate, docs update.
 */
export interface ContractProp {
  type?: string
  required?: boolean
  description?: string
  default?: unknown
  values?: string[]
  payload?: string
}

export interface ContractExport {
  name: string
  kind: 'component' | 'hook' | 'function' | 'type'
  signature: string
  description: string
}

export interface ContractVariant {
  name: string
  values: string[]
  default?: string
  description?: string
}

export interface ContractState {
  name: string
  description?: string
}

export interface ContractDoc {
  schemaVersion?: string
  slug?: string
  name?: string
  status?: string
  purpose?: string
  scenarios?: string[]
  props?: Record<string, ContractProp>
  variants?: ContractVariant[]
  states?: ContractState[]
  composition?: {
    allowedParents?: string[]
    allowedChildren?: string[]
    requiredContext?: string[]
  }
  antiPatterns?: string[]
  a11y?: {
    role?: string
    keyboard?: string[]
    focus?: string
    labeling?: string
    wcag?: string[]
  }
  responsive?: {
    strategy?: string
    breakpoints?: Record<string, string>
  }
  platforms?: Record<string, string>
  rtl?: {
    supported?: boolean
    strategy?: string
    mirroredValues?: string[]
  }
  dataAi?: { role?: string; states?: string[]; intents?: string[] }
  mechanics?: string
  usage?: string[]
  exports?: ContractExport[]
}

export function getContract(slug: string): ContractDoc | null {
  return CONTRACTS[slug] ?? null
}

/** True when the contract carries enough structured data to render the full template. */
export function hasStructuredDocs(contract: ContractDoc | null): contract is ContractDoc {
  return Boolean(contract && contract.purpose && contract.props)
}
