// Docs-site chrome is authored for zh-CN / zh-HK / en only.
// Product ICU remains 21 locales under packages/components/**/locales — do not delete those.
// This script no longer writes English ICU skeletons for the other 18 product locales.

import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const here = dirname(fileURLToPath(import.meta.url))
const docsRoot = join(here, '..')
const localesDir = join(docsRoot, 'src', 'locales')
const publicCompliance = join(docsRoot, 'static', 'compliance')
const reportsDir = join(docsRoot, '..', '..', '..', 'docs', 'project', 'reports')
const componentsRoot = dirname(require.resolve('@chameleon-ui/components/catalog.json'))

const DOCS_SITE_LOCALES = ['zh-CN', 'zh-HK', 'en']
const AUTHORED = new Set(DOCS_SITE_LOCALES)
const ETA = '2026-09-30'
const OWNER = '待指定'

const DOCS_PAGES = [
  { id: 'chrome', label: 'Docs chrome (nav/shell)' },
  { id: 'home', label: 'Home (marketing-adjacent)' },
  { id: 'components-index', label: 'Components index' },
  { id: 'component-contract', label: 'Component contract body' },
  { id: 'themes', label: 'Themes' },
  { id: 'locales', label: 'Locales' },
  { id: 'install', label: 'Install' },
  { id: 'schema', label: 'Schema' },
  { id: 'bench', label: 'Bench' },
  { id: 'telemetry', label: 'Telemetry' },
  { id: 'vpat', label: 'VPAT' },
  { id: 'dashboard', label: 'North-star dashboard' },
  { id: 'gaps', label: 'Locale gap table' },
  { id: 'marketing', label: 'Marketing pages' },
]

function flatten(value, prefix = '') {
  if (typeof value === 'string') return prefix ? { [prefix]: value } : {}
  if (value === null || typeof value !== 'object') return {}
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, nested]) =>
      Object.entries(flatten(nested, prefix ? `${prefix}.${key}` : key)),
    ),
  )
}

const catalog = JSON.parse(await readFile(join(componentsRoot, 'catalog.json'), 'utf8'))
const en = JSON.parse(await readFile(join(localesDir, 'en.json'), 'utf8'))
const enKeys = Object.keys(flatten(en)).sort().join(',')

await mkdir(localesDir, { recursive: true })
await mkdir(publicCompliance, { recursive: true })
await mkdir(reportsDir, { recursive: true })

for (const name of await readdir(localesDir)) {
  if (!name.endsWith('.json')) continue
  const id = name.slice(0, -5)
  if (!AUTHORED.has(id)) {
    await unlink(join(localesDir, name))
  }
}

for (const locale of DOCS_SITE_LOCALES) {
  const json = JSON.parse(await readFile(join(localesDir, `${locale}.json`), 'utf8'))
  if (json._cuSkeleton) {
    throw new Error(`docs chrome ${locale}.json must be authored, not a skeleton`)
  }
  const keys = Object.keys(flatten(json)).sort().join(',')
  if (keys !== enKeys) {
    throw new Error(`docs chrome ${locale}.json key set does not match en.json`)
  }
}

async function componentIcuStatus(locale) {
  let present = 0
  for (const item of catalog.components) {
    try {
      await readFile(join(componentsRoot, 'src', item.slug, 'locales', `${locale}.json`), 'utf8')
      present += 1
    } catch {
      // missing
    }
  }
  return { present, total: catalog.components.length }
}

const rows = []

for (const locale of DOCS_SITE_LOCALES) {
  const authoredNote =
    locale === 'en' ? 'authored English' : locale === 'zh-HK' ? 'authored zh-HK' : 'authored zh-CN'

  for (const page of DOCS_PAGES) {
    let status = 'green'
    let legacy = null
    let note = authoredNote

    if (page.id === 'component-contract') {
      status = 'gap'
      legacy = 'LEGACY-2026-017'
      note = 'contract.json body is English-only'
    } else if (page.id === 'marketing') {
      status = 'gap'
      legacy = 'LEGACY-2026-005'
      note = 'No dedicated marketing site. Do not claim marketing pages complete.'
    }

    rows.push({
      language: locale,
      page: page.id,
      pageLabel: page.label,
      status,
      eta: status === 'green' ? null : ETA,
      owner: status === 'green' ? null : OWNER,
      legacy,
      note,
    })
  }
}

for (const locale of catalog.locales) {
  const icu = await componentIcuStatus(locale)
  const icuGreen = icu.present === icu.total
  rows.push({
    language: locale,
    page: 'component-icu',
    pageLabel: 'Component product ICU',
    status: icuGreen ? 'green' : 'gap',
    eta: icuGreen ? null : ETA,
    owner: icuGreen ? null : OWNER,
    legacy: icuGreen ? null : 'LEGACY-2026-017',
    note: `${icu.present}/${icu.total} component ICU files`,
  })
}

const gapRows = rows.filter((row) => row.status !== 'green')
const table = {
  generatedAt: new Date().toISOString(),
  definition:
    'Docs site UI is 3 locales (zh-CN default, zh-HK, en), all authored chrome. Product ICU remains 21 locales on component pages. Marketing pages are out of scope and never claimed complete.',
  docsSiteLocales: [...DOCS_SITE_LOCALES],
  docsDefaultLocale: 'zh-CN',
  authoredChrome: [...AUTHORED],
  productLocales: catalog.locales,
  skeletonLocales: [],
  etaForGaps: ETA,
  ownerForGaps: OWNER,
  pages: [...DOCS_PAGES, { id: 'component-icu', label: 'Component product ICU' }],
  rows,
  gapCount: gapRows.length,
  greenCount: rows.length - gapRows.length,
}

await writeFile(
  join(publicCompliance, 'locale-gap-table.json'),
  `${JSON.stringify(table, null, 2)}\n`,
  'utf8',
)

const md = [
  '# 文档站 3 语缺口表（产品 Locale 仍为 21）',
  '',
  `> 生成日期：${table.generatedAt}`,
  '> 文档站一等语言：`zh-CN`（默认，无前缀）/ `zh-HK`（`/zh-HK/`）/ `en`（`/en/`）。chrome 三种均为撰稿译文。',
  '> **产品**组件 ICU 仍为 21 Locale（`packages/components/**/locales`）。**营销页不宣称完成**（LEGACY-2026-005）。',
  `> 缺口 ETA：${ETA} · owner：${OWNER}`,
  '',
  '## 摘要',
  '',
  `| 单元格 | 数量 |`,
  `| :--- | ---: |`,
  `| 文档站 language × page + 产品 ICU | ${rows.length} |`,
  `| green | ${table.greenCount} |`,
  `| 非绿（下表） | ${table.gapCount} |`,
  '',
  '文档站不再为其余 18 个产品 Locale 生成 Docusaurus 前缀或英文 ICU chrome 骨架。',
  '',
  '## 非绿单元格（language × page × ETA × owner）',
  '',
  '| language | page | ETA | owner | id | note |',
  '| :--- | :--- | :--- | :--- | :--- | :--- |',
  ...gapRows.map(
    (row) =>
      `| ${row.language} | ${row.page} | ${row.eta} | ${row.owner} | ${row.legacy ?? '—'} | ${row.note} |`,
  ),
  '',
  '机器可读：`chameleon-ui/apps/docs/static/compliance/locale-gap-table.json`。',
  '',
].join('\n')

await writeFile(join(reportsDir, 'Phase-4-文档21语缺口表.md'), md, 'utf8')
await writeFile(join(publicCompliance, 'locale-gap-table.md'), md, 'utf8')

const files = (await readdir(localesDir)).filter((name) => name.endsWith('.json'))
console.log(
  `docs locales: site=${DOCS_SITE_LOCALES.join(',')} product=${catalog.locales.length} chromeFiles=${files.length} gaps=${table.gapCount}`,
)
