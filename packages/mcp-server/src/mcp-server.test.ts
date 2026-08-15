import { describe, expect, it } from 'vitest'
import { MCP_TOOL_NAMES } from './constants.js'
import { extractContract, extractDesignRules } from './extract.js'
import { handleMessage, TOOL_DEFINITIONS } from './server.js'
import { consumerImportSpecifiers } from './specifiers.js'

function call(name: string, args: Record<string, unknown> = {}, id = 1) {
  return handleMessage({
    jsonrpc: '2.0',
    id,
    method: 'tools/call',
    params: { name, arguments: args },
  })
}

describe('MCP tool surface', () => {
  it('lists every locked tool name in order', async () => {
    const listed = await handleMessage({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
    const names = (
      listed?.result as { tools: Array<{ name: string }> } | undefined
    )?.tools.map((tool) => tool.name)
    expect(names).toEqual([...MCP_TOOL_NAMES])
    expect(TOOL_DEFINITIONS.map((tool) => tool.name)).toEqual([...MCP_TOOL_NAMES])
  })

  it('initialize returns consumer instructions', async () => {
    const response = await handleMessage({ jsonrpc: '2.0', id: 1, method: 'initialize' })
    const result = response?.result as { instructions?: string }
    expect(result.instructions).toContain('get_started')
    expect(result.instructions).toContain('@chameleon-ui/react/css')
    expect(result.instructions).toContain('theme="line"')
  })

  it('get_started returns catalog, line flagship, and CSS recipe', async () => {
    const response = await call('get_started')
    expect(response?.error).toBeUndefined()
    const result = response?.result as {
      must: { css: { react: string }; themeProvider: { theme: string } }
      catalogSummary: { total: number; common10: string[] }
      themes: { flagship: string }
      toolOrder: string[]
    }
    expect(result.must.css.react).toBe('@chameleon-ui/react/css')
    expect(result.must.themeProvider.theme).toBe('line')
    expect(result.themes.flagship).toBe('line')
    expect(result.catalogSummary.total).toBeGreaterThan(50)
    expect(result.catalogSummary.common10).toContain('button')
    expect(result.toolOrder[0]).toBe('get_started')
  })

  it('list_components groups by family and filters', async () => {
    const all = await call('list_components')
    const listed = all?.result as {
      total: number
      families: Array<{ family: string; slugs: string[] }>
    }
    expect(listed.total).toBeGreaterThan(50)
    expect(listed.families.some((entry) => entry.family === 'C')).toBe(true)

    const filtered = await call('list_components', { family: 'C' })
    const one = filtered?.result as {
      total: number
      families: Array<{ family: string; slugs: string[] }>
    }
    expect(one.families).toHaveLength(1)
    expect(one.families[0]?.family).toBe('C')
    expect(one.families[0]?.slugs).toContain('button')
  })

  it('search_components by intent returns button for submit', async () => {
    const response = await call('search_components', { intent: 'submit' })
    const items = (response?.result as { items: Array<{ id: string }> }).items
    expect(items[0]?.id).toBe('button')
    expect(items.some((item) => item.id === 'button')).toBe(true)
  })

  it('get_contract returns v0.2 JSON for button by slug', async () => {
    const response = await call('get_contract', { slug: 'button' })
    expect(response?.error).toBeUndefined()
    const result = response?.result as {
      slug: string
      schemaVersion: string
      contract: { dataAi: { role: string; intents: string[] } }
      export: string
    }
    expect(result.slug).toBe('button')
    expect(result.schemaVersion).toBe('0.2')
    expect(result.contract.dataAi.role).toBe('button')
    expect(result.contract.dataAi.intents).toContain('submit')
    expect(result.export).toBe('@chameleon-ui/components/contracts/button')
  })

  it('get_contract accepts id as an alias of slug', async () => {
    const response = await call('get_contract', { id: 'table' })
    const result = response?.result as { slug: string; schemaVersion: string }
    expect(result.slug).toBe('table')
    expect(result.schemaVersion).toBe('0.2')
  })

  it('get_contract rejects unknown slugs', async () => {
    const response = await call('get_contract', { slug: 'not-a-component' })
    expect(response?.error?.message).toMatch(/Unknown component/)
  })

  it('get_design_rules returns cupertino rules with rtl', async () => {
    const response = await call('get_design_rules', { theme_id: 'cupertino' })
    expect(response?.error).toBeUndefined()
    const result = response?.result as {
      id: string
      version: string
      rules: { rtl: { supported: boolean } }
    }
    expect(result.id).toBe('cupertino')
    expect(result.version).toBe('1.0')
    expect(result.rules.rtl.supported).toBe(true)
  })

  it('list_themes returns the 8 official ids', async () => {
    const response = await call('list_themes')
    const themes = (response?.result as { themes: Array<{ id: string }> }).themes
    expect(themes.map((item) => item.id).sort()).toEqual(
      [
        'ant-blue',
        'corsa',
        'cupertino',
        'line',
        'silver-arrow',
        'siren',
        'stuttgart',
        'wechat',
      ].sort(),
    )
  })

  it('get_import_specifiers defaults to line and still accepts cupertino', async () => {
    const defaulted = await call('get_import_specifiers')
    const defaultResult = defaulted?.result as ReturnType<typeof consumerImportSpecifiers>
    expect(defaultResult.themeId).toBe('line')
    expect(defaultResult.preferred.themeCss).toBe('@chameleon-ui/themes/line/css')
    expect(defaultResult.preferred.umbrellaReactCss).toBe('@chameleon-ui/react/css')

    const response = await call('get_import_specifiers', { theme_id: 'cupertino' })
    const result = response?.result as ReturnType<typeof consumerImportSpecifiers>
    expect(result.preferred.themeCss).toBe('@chameleon-ui/themes/cupertino/css')
    expect(result.preferred.tokensCss).toBe('@chameleon-ui/tokens/css')
    expect(result.preferred.umbrellaReact).toBe('@chameleon-ui/react')
    expect(result.preferred.umbrellaVue).toBe('@chameleon-ui/vue')
    expect(result.preferred.umbrellaReactCss).toBe('@chameleon-ui/react/css')
    expect(result.preferred.umbrellaVueCss).toBe('@chameleon-ui/vue/css')
    expect(result.preferred.umbrellaVueThemeCss).toBe('@chameleon-ui/vue/themes/cupertino/css')
    expect(result.preferred.components).toBe('@chameleon-ui/react')
    expect(result.alsoValid.themeCssDist).toBe(
      '@chameleon-ui/themes/dist/cupertino/variables.css',
    )
    expect(result.never).toContain('@chameleon-ui/themes/cupertino/variables.css')
    expect(result.never).toContain('workspace:*')
    expect(result.unpublishedLink.inExternalApp).toBe('npm link @chameleon-ui/react')
    expect(result.unpublishedLink.inExternalAppVue).toBe('npm link @chameleon-ui/vue')
    expect(result.unpublishedLink.legacyFiveInExternalApp).toContain('@chameleon-ui/tokens')
    expect(result.unpublishedLink.legacyFiveInExternalApp).toContain('@chameleon-ui/components')
    expect(result.unpublishedLink.viteTemplate).toBe('templates/external-vite-react')
    expect(result.unpublishedLink.viteTemplateVue).toBe('templates/external-vite-vue')
    expect(result.unpublishedLink.legacyFiveInExternalAppVue).toContain('@chameleon-ui/components-vue')
    expect(result.unpublishedLink.legacyFiveInExternalAppVue).toContain('@chameleon-ui/primitives-vue')
    expect(result.preferred.componentsVue).toBe('@chameleon-ui/vue')
    expect(result.preferred.componentVueSlug).toBe('@chameleon-ui/components-vue/button')
    expect(result.preferred.componentsVueCss).toBe('@chameleon-ui/components-vue/css')
    expect(result.preferred.schemaRendererVue).toBe('@chameleon-ui/schema-renderer/vue')
    expect(result.unpublishedLink.note).toContain('0.2.0')
    expect(result.preferred.componentSlug).toBe('@chameleon-ui/components/button')
    expect(result.versionMatrix.arkUi).toBe('5.38.0')
    expect(result.versionMatrix.arkUiVue).toBe('5.38.1')
    expect(result.versionMatrix.vue).toBe('^3.5.0')
  })

  it('rejects unknown tools', async () => {
    const response = await call('invented_tool')
    expect(response?.error?.message).toMatch(/Unknown tool/)
  })
})

describe('extract helpers', () => {
  it('parses contract and design-rules from registry-shaped files', () => {
    const contract = extractContract({
      id: 'button',
      type: 'registry:ui',
      name: 'Button',
      files: [
        {
          path: 'components/button/contract.json',
          content: '{"schemaVersion":"0.2","slug":"button"}',
        },
      ],
    })
    expect(contract).toEqual({ schemaVersion: '0.2', slug: 'button' })

    const rules = extractDesignRules({
      id: 'cupertino',
      type: 'registry:theme',
      name: 'Cupertino',
      files: [
        {
          path: 'themes/cupertino/design-rules.json',
          content: '{"version":"1.0"}',
        },
      ],
    })
    expect(rules).toEqual({ version: '1.0' })
  })
})
