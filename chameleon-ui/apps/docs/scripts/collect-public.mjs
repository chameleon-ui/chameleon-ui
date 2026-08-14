import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const here = dirname(fileURLToPath(import.meta.url))
const staticRoot = join(here, '..', 'static')

const catalogPath = require.resolve('@chameleon-ui/components/catalog.json')
const schemaPath = require.resolve('@chameleon-ui/contract/component-contract.schema.json')
const contractPkgRoot = dirname(dirname(schemaPath))
const componentsRoot = dirname(catalogPath)

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
const schema = await readFile(schemaPath, 'utf8')
const schemaV01 = await readFile(
  join(contractPkgRoot, 'schemas', 'component-contract.v0.1.json'),
  'utf8',
)
const designRulesSchema = await readFile(
  join(contractPkgRoot, 'schemas', 'design-rules.schema.json'),
  'utf8',
)
const { themeIds } = await import('@chameleon-ui/themes')

const schemaDir = join(staticRoot, 'schemas', 'component-contract')
const designRulesSchemaDir = join(staticRoot, 'schemas', 'design-rules')
const contractsDir = join(staticRoot, 'contracts')
await mkdir(schemaDir, { recursive: true })
await mkdir(designRulesSchemaDir, { recursive: true })
await mkdir(contractsDir, { recursive: true })

await import(pathToFileURL(join(here, 'generate-docs-locale-skeletons.mjs')).href)

await writeFile(join(schemaDir, 'v0.2.json'), schema, 'utf8')
await writeFile(join(schemaDir, 'v0.1.json'), schemaV01, 'utf8')
await writeFile(join(designRulesSchemaDir, 'v1.0.json'), designRulesSchema, 'utf8')
await writeFile(join(staticRoot, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')

const slugs = []
for (const item of catalog.components) {
  const slug = item.slug
  slugs.push(slug)
  const contractPath = join(componentsRoot, 'src', slug, 'contract.json')
  const contract = await readFile(contractPath, 'utf8')
  await writeFile(join(contractsDir, `${slug}.json`), contract, 'utf8')
}

const inventory = {
  generatedAt: new Date().toISOString(),
  expanding: true,
  components: {
    count: slugs.length,
    slugs,
    target: { min: 45, note: 'Phase 2 public band was 45–50; catalog v2.0 is larger and unsigned at freeze meeting' },
    note: 'Catalog is live from packages/components/catalog.json (v2.0). Freeze-meeting unsigned (owner 待指定).',
  },
  themes: {
    ids: [...themeIds],
    count: themeIds.length,
    target: 8,
    legal: 'owner-cleared-2026-08-13',
    note: 'Official homage themes (8) cleared by the project owner on 2026-08-13 (owner confirmation, not a third-party legal opinion). Listed as free SKUs. Community packs may be free or paid. Do not claim unmeasured recognition rates.',
  },
  locales: {
    ids: catalog.locales,
    count: catalog.locales.length,
    target: 21,
    docsSite: ['zh-CN', 'zh-HK', 'en'],
    docsDefault: 'zh-CN',
    note: 'Product locales follow catalog.json (21). Docs site UI is 3 locales: zh-CN (default, no prefix), zh-HK (/zh-HK/), en (/en/). Component ICU files remain 21. Marketing pages are not claimed complete.',
  },
  schema: {
    path: '/schemas/component-contract/v0.2.json',
    id: 'https://chameleon-ui.dev/schemas/component-contract/v0.2.json',
    archived: '/schemas/component-contract/v0.1.json',
    designRules: '/schemas/design-rules/v1.0.json',
    hosted: 'docs-public',
    note: 'Public GET pending docs deployment; paths are served by the docs site build (Docusaurus static/).',
  },
}

await writeFile(join(staticRoot, 'inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`, 'utf8')

const benchSrcDir = join(here, '..', '..', '..', 'benchmarks', 'genui-bench', 'reports')
const benchDir = join(staticRoot, 'bench')
await mkdir(benchDir, { recursive: true })
const emptyBench = {
  generatedAt: null,
  metrics: [],
  note: 'empty-state: run bench:genui',
}
try {
  await writeFile(join(benchDir, 'latest.json'), await readFile(join(benchSrcDir, 'latest.json'), 'utf8'), 'utf8')
} catch {
  await writeFile(join(benchDir, 'latest.json'), `${JSON.stringify(emptyBench, null, 2)}\n`, 'utf8')
}
try {
  await writeFile(join(benchDir, 'latest.md'), await readFile(join(benchSrcDir, 'latest.md'), 'utf8'), 'utf8')
} catch {
  await writeFile(
    join(benchDir, 'latest.md'),
    '# GenUI-Bench\n\nempty-state: run `corepack pnpm@9.15.0 bench:genui`.\nDo not invent scores.\n',
    'utf8',
  )
}
// report.html (not index.html): docs route /bench is the MDX page; do not collide.
try {
  await writeFile(join(benchDir, 'report.html'), await readFile(join(benchSrcDir, 'index.html'), 'utf8'), 'utf8')
} catch {
  await writeFile(
    join(benchDir, 'report.html'),
    '<!doctype html><html lang="en"><head><meta charset="utf-8"/><title>GenUI-Bench</title></head><body><p>empty-state: run <code>corepack pnpm@9.15.0 bench:genui</code>. Do not invent scores.</p></body></html>\n',
    'utf8',
  )
}

const auditSrc = join(here, '..', '..', '..', '..', 'docs', 'project', 'reports', 'Phase-4-全量性能与a11y审计.md')
try {
  const audit = await readFile(auditSrc, 'utf8')
  await mkdir(join(staticRoot, 'compliance'), { recursive: true })
  await writeFile(join(staticRoot, 'compliance', 'Phase-4-perf-a11y-audit.md'), audit, 'utf8')
} catch {
  // report may be generated in the same slice; collect still succeeds
}

console.log(
  `docs static: ${slugs.length} contracts, ${themeIds.length} themes, ${catalog.locales.length} locales`,
)
