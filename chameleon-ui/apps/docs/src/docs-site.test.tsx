import catalog from '@chameleon-ui/components/catalog.json'
import { access, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ComponentPage from './components/ComponentPage'
import CatalogIndex from './components/CatalogIndex'
import Dashboard from './components/Dashboard'
import { installCommand } from './install'
import { getTranslator } from './messages'
import { installThemeStyles, readThemeQuery } from './theme'

const here = path.dirname(fileURLToPath(import.meta.url))

describe('install-core CLI copy', () => {
  it('builds install-core CLI commands rather than a third writer', () => {
    expect(installCommand('button')).toBe('chameleon add button')
  })
})

describe('theme overlays', () => {
  it('installs scoped theme overlays once', () => {
    installThemeStyles()
    installThemeStyles()
    expect(document.querySelectorAll('#cu-theme-overlays')).toHaveLength(1)
  })

  it('reads ?theme= query the same way demo color overlays switch', () => {
    expect(readThemeQuery('?theme=line')).toBe('line')
    expect(readThemeQuery('?theme=ant-blue')).toBe('ant-blue')
    expect(readThemeQuery('?theme=not-a-theme')).toBeNull()
  })
})

describe('MDX component pages (contract SSOT)', () => {
  it('renders the full structured template for a gold-batch component', () => {
    const { t } = getTranslator('en')
    render(<ComponentPage slug="button" t={t} />)
    expect(document.querySelector('[data-docs="usage"]')).not.toBeNull()
    expect(document.querySelector('[data-docs="examples"]')).not.toBeNull()
    expect(document.querySelector('[data-docs="code"]')).not.toBeNull()
    expect(document.querySelector('[data-docs="api"]')).not.toBeNull()
    expect(document.querySelector('[data-docs="props-table"]')).not.toBeNull()
    expect(document.querySelector('[data-docs="a11y"]')).not.toBeNull()
    expect(document.querySelector('[data-docs="responsive"]')).not.toBeNull()
    expect(document.querySelector('[data-docs="rtl"]')).not.toBeNull()
    expect(document.querySelector('[data-docs="tokens"]')).not.toBeNull()
    expect(document.querySelector('[data-docs-preview="button"]')).not.toBeNull()
    expect(screen.getByText('chameleon add button')).not.toBeNull()
  })

  it('renders a live preview for family-F chart', () => {
    const { t } = getTranslator('en')
    render(<ComponentPage slug="chart" t={t} />)
    expect(document.querySelector('[data-docs="api"]')).not.toBeNull()
    expect(document.querySelector('[data-docs="props-table"]')).not.toBeNull()
    expect(document.querySelector('[data-docs-preview="chart"]')).not.toBeNull()
    expect(document.querySelector('[data-docs="preview-pending"]')).toBeNull()
  })

  it('renders contract API for a family-G slug even when playground is pending', () => {
    const { t } = getTranslator('en')
    render(<ComponentPage slug="mind-map" t={t} />)
    expect(document.querySelector('[data-docs="api"]')).not.toBeNull()
    expect(document.querySelector('[data-docs="props-table"]')).not.toBeNull()
    expect(document.querySelector('[data-docs="preview-pending"]')).not.toBeNull()
    expect(document.querySelector('[data-docs-preview="mind-map"]')).toBeNull()
  })
})

describe('catalog index', () => {
  it('lists every catalog component grouped by family', () => {
    render(<CatalogIndex />)
    expect(document.querySelector('[data-docs-family="A"]')).not.toBeNull()
    expect(document.querySelector('[data-docs-family="H"]')).not.toBeNull()
    for (const item of catalog.components) {
      expect(document.querySelector(`[data-docs-slug="${item.slug}"]`), item.slug).not.toBeNull()
    }
  })
})

describe('generated MDX stubs', () => {
  const componentsDir = path.resolve(here, '../docs/components')

  it('has one MDX page per catalog slug plus live fences for gold 8 and the live set', async () => {
    const files = (await readdir(componentsDir)).filter((name) => name.endsWith('.mdx'))
    expect(files).toHaveLength(catalog.components.length + 1)
    const meta = JSON.parse(await readFile(path.join(here, 'generated/slugs.json'), 'utf8')) as {
      gold: string[]
      live: string[]
    }
    const liveMdx = new Set([...meta.gold, ...meta.live])
    expect(meta.gold).toEqual(['button', 'input', 'select', 'dialog', 'table', 'tabs', 'form', 'card'])
    expect(meta.live).toEqual([
      'accordion',
      'combobox',
      'drawer',
      'pagination',
      'slider',
      'date-picker',
      'data-grid',
      'chat-bubble',
      'sparkline',
      'action-sheet',
    ])
    for (const item of catalog.components) {
      const source = await readFile(path.join(componentsDir, `${item.slug}.mdx`), 'utf8')
      expect(source).toContain(`slug="${item.slug}"`)
      expect(source).toContain('ComponentPage')
      expect(source).not.toMatch(/variant\?:/)
      if (liveMdx.has(item.slug)) {
        expect(source).toContain(`import Gold from './_gold/${item.slug}.mdx'`)
        expect(source).toContain('includePlayground={false}')
      } else {
        expect(source).not.toContain("import Gold from './_gold/")
      }
    }
    for (const slug of liveMdx) {
      const gold = await readFile(path.join(componentsDir, `_gold/${slug}.mdx`), 'utf8')
      expect(gold, slug).toMatch(/```jsx live/)
    }
  })
})

describe('dashboard', () => {
  it('renders a read-only north-star dashboard with bench.* ids and empty telemetry', () => {
    render(<Dashboard />)
    expect(document.querySelector('[data-docs="dashboard-empty"]')).not.toBeNull()
    expect(document.querySelector('[data-metric="bench.install_success_rate"]')).not.toBeNull()
    expect(document.querySelector('[data-metric="telemetry.install"]')).not.toBeNull()
    expect(document.querySelector('[data-metric="telemetry.intent_vs_adopt"]')).not.toBeNull()
  })
})

describe('docs public artifacts', () => {
  const staticRoot = path.resolve(here, '../static')
  const localesRoot = path.resolve(here, 'locales')

  it('copies GenUI-Bench reports into static/bench and links them from the bench MDX page', async () => {
    const benchPage = await readFile(path.join(here, '../docs/bench.mdx'), 'utf8')
    expect(benchPage).toContain('pathname:///bench/latest.json')
    expect(benchPage).toContain('pathname:///bench/latest.md')
    expect(benchPage).toContain('pathname:///bench/report.html')
    await access(path.join(staticRoot, 'bench/latest.json'))
    await access(path.join(staticRoot, 'bench/latest.md'))
    await access(path.join(staticRoot, 'bench/report.html'))
  })

  it('serves the versioned contract schema copied from the official package', async () => {
    const schema = JSON.parse(
      await readFile(path.join(staticRoot, 'schemas/component-contract/v0.1.json'), 'utf8'),
    ) as { $id?: string }
    expect(schema.$id).toBe('https://chameleon-ui.dev/schemas/component-contract/v0.1.json')
  })

  it('publishes VPAT draft artifacts named for v0.0.0', async () => {
    const md = await readFile(path.join(staticRoot, 'compliance/VPAT-ChameleonUI-v0.0.0.md'), 'utf8')
    const pdfNamed = await readFile(
      path.join(staticRoot, 'compliance/VPAT-ChameleonUI-v0.0.0.pdf.md'),
      'utf8',
    )
    expect(md).toMatch(/status=draft/)
    expect(md).toMatch(/Not certified/)
    expect(md).not.toMatch(/status=certified/)
    expect(pdfNamed).toMatch(/VPAT-ChameleonUI-v0\.0\.0\.pdf/)
  })

  it('authors chrome for the three docs-site locales only', async () => {
    const files = (await readdir(localesRoot)).filter((name) => name.endsWith('.json')).sort()
    expect(files).toEqual(['en.json', 'zh-CN.json', 'zh-HK.json'])
    for (const locale of ['zh-CN', 'zh-HK', 'en']) {
      const json = JSON.parse(await readFile(path.join(localesRoot, `${locale}.json`), 'utf8')) as {
        _cuSkeleton?: boolean
        docs?: { title?: string }
      }
      expect(json.docs?.title, locale).toBeTruthy()
      expect(json._cuSkeleton, locale).toBeUndefined()
    }
    expect(getTranslator('zh-HK').authoredChrome).toBe(true)
    expect(catalog.locales).toHaveLength(21)
  })

  it('publishes a three-end guide that points at the inner-demo playground', async () => {
    const page = await readFile(path.join(here, '../docs/guides/three-end.mdx'), 'utf8')
    expect(page).toContain('http://127.0.0.1:5175/?view=three-end')
    expect(page).toContain('TabBar')
    expect(page).toContain('ActionSheet')
    expect(page).toContain('density.css')
  })
})

describe('docs import boundary', () => {
  it('does not import poc/ from the docs app source', async () => {
    const srcRoot = path.resolve(here)
    const files = (await readdir(srcRoot, { recursive: true })).filter((relativePath) =>
      /\.(ts|tsx|css|mjs)$/.test(String(relativePath).replaceAll('\\', '/')),
    )
    const violations: string[] = []
    for (const relativePath of files) {
      if (/\.test\./.test(String(relativePath))) continue
      const source = await readFile(path.join(srcRoot, String(relativePath)), 'utf8')
      if (/(?:from|import)\s+['"][^'"]*poc\//.test(source) || /@chameleon-ui\/poc-/.test(source)) {
        violations.push(String(relativePath))
      }
    }
    expect(violations, violations.join(', ')).toEqual([])
  })
})

vi.stubGlobal(
  'fetch',
  vi.fn(async (input: RequestInfo) => {
    const url = String(input)
    if (url.endsWith('/bench/latest.json')) {
      return {
        ok: true,
        json: async () => ({
          generatedAt: '2026-08-13T00:00:00.000Z',
          metrics: [
            {
              id: 'bench.install_success_rate',
              value: 1,
              note: 'fixture for docs tests; not a live north-star claim',
            },
          ],
        }),
      }
    }
    if (url.endsWith('/compliance/locale-gap-table.json')) {
      return {
        ok: true,
        json: async () => ({
          gapCount: 1,
          greenCount: 1,
          etaForGaps: '2026-09-30',
          ownerForGaps: '待指定',
          rows: [
            {
              language: 'ar',
              page: 'marketing',
              status: 'gap',
              eta: '2026-09-30',
              owner: '待指定',
              legacy: 'LEGACY-2026-005',
              note: 'fixture',
            },
          ],
        }),
      }
    }
    return { ok: false, json: async () => null }
  }),
)
