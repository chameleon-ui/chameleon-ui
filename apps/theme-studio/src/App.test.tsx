import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import lineRules from '@chameleon-ui/themes/line/design-rules'
import { App } from './App'
import { createExportPayload } from './ExportPage'
import { formatValidationIssues, validateDesignRules } from './validateRules'
import { themeBundles } from './themeData'

describe('validateDesignRules', () => {
  it('accepts official line theme rules', () => {
    expect(validateDesignRules(lineRules)).toEqual([])
  })

  it('rejects documents missing Phase 3 groups', () => {
    const issues = validateDesignRules({ version: '1.0' })
    expect(issues.length).toBeGreaterThan(0)
    expect(formatValidationIssues(issues)).toMatch(/typography|spacing|rtl/)
  })
})

describe('theme bundles', () => {
  it('loads all eight themes with schema-valid rules', () => {
    for (const bundle of Object.values(themeBundles)) {
      expect(validateDesignRules(bundle.designRules)).toEqual([])
    }
  })
})

describe('App', () => {
  it('renders the editor route with theme selector', () => {
    window.history.replaceState(null, '', '/editor?theme=line')
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Editor' })).toBeInTheDocument()
    expect(screen.getByLabelText('Theme')).toBeInTheDocument()
    expect(screen.getByLabelText('Design rules JSON')).toBeInTheDocument()
  })

  it('renders the export route when rules are schema-valid', () => {
    window.history.replaceState(null, '', '/export?theme=line')
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Export' })).toBeInTheDocument()
    expect(screen.getByText(/Ready — all Phase 3 design-rules groups present/)).toBeInTheDocument()
  })
})

describe('createExportPayload', () => {
  it('marks generator=theme-studio and keeps all eight themes schema-valid', () => {
    for (const bundle of Object.values(themeBundles)) {
      const payload = createExportPayload(bundle.id, bundle.designRules, bundle.tokens, bundle.meta)
      expect(payload.generator).toBe('theme-studio')
      expect(validateDesignRules(payload.designRules)).toEqual([])
    }
  })

  it('exports tokens as a $extends delta (empty when unmodified)', () => {
    for (const bundle of Object.values(themeBundles)) {
      const payload = createExportPayload(bundle.id, bundle.designRules, bundle.tokens, bundle.meta)
      expect(payload.extends).toBe(bundle.id)
      expect(payload.tokens).toEqual({})
      expect(payload.removedTokenPaths).toEqual([])
    }
  })

  it('records changed leaves in the delta and reports removals separately', () => {
    const bundle = themeBundles['line']
    const edited = structuredClone(bundle.tokens) as Record<string, unknown>
    const radius = edited.radius as Record<string, unknown>
    // line baseline md is already 8px — bump to a distinct value so the delta is non-empty
    radius.md = { $value: { value: 10, unit: 'px' } }
    delete radius.sm

    const payload = createExportPayload('line', bundle.designRules, edited, bundle.meta)
    expect(payload.extends).toBe('line')
    expect(payload.tokens).toEqual({ radius: { md: { $value: { value: 10, unit: 'px' } } } })
    expect(payload.removedTokenPaths).toEqual(['radius.sm'])
  })
})
