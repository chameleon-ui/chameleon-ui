/**
 * Generates docs/ai/data-ai-vocabulary.json + .md from the Phase 8 codemod
 * vocabulary and cross-checks that every catalog contract intent is covered.
 * Run: node scripts/generate-data-ai-vocabulary.mjs [--check]
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { INTENT_VOCABULARY, COMPONENT_INTENTS } from './codemod-phase8-contracts.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = join(root, '..', 'docs', 'ai')
const checkOnly = process.argv.includes('--check')

async function main() {
  const catalog = JSON.parse(
    await readFile(join(root, 'packages', 'components', 'catalog.json'), 'utf8'),
  )
  const gated = catalog.components
  const usedIntents = new Set()
  const problems = []
  for (const component of gated) {
    const contract = JSON.parse(
      await readFile(
        join(root, 'packages', 'components', 'src', component.slug, 'contract.json'),
        'utf8',
      ),
    )
    for (const intent of contract.dataAi?.intents ?? []) usedIntents.add(intent)
  }
  for (const intent of usedIntents) {
    if (!INTENT_VOCABULARY[intent]) problems.push(`intent "${intent}" used but not in vocabulary`)
  }
  // Extra vocabulary entries (registered but unused yet) are allowed.
  const unregisteredComponents = gated
    .map((component) => component.slug)
    .filter((slug) => !COMPONENT_INTENTS[slug])
  for (const slug of unregisteredComponents) {
    problems.push(`component "${slug}" missing from COMPONENT_INTENTS`)
  }
  if (problems.length > 0) {
    throw new Error(`vocabulary drift:\n - ${problems.join('\n - ')}`)
  }

  const sorted = Object.entries(INTENT_VOCABULARY).sort(([a], [b]) => a.localeCompare(b, 'en'))
  const json = `${JSON.stringify(
    {
      $comment:
        'Phase 8 A5 frozen data-ai-intent lexicon. Gate: catalog-data-ai.test.ts + this script --check.',
      version: '1.0',
      frozenAt: '2026-08-13',
      intents: Object.fromEntries(sorted),
    },
    null,
    2,
  )}\n`

  const rows = sorted.map(([id, description]) => `| \`${id}\` | ${description} |`).join('\n')
  const markdown = `# data-ai 值域文档（Phase 8 A5 冻结）

> 机读版：\`data-ai-vocabulary.json\`（同目录）。契约侧字段：\`dataAi.role/states/intents\`（[v0.2 映射表](./component-contract-v0.2-mapping.md)）。  
> 纪律：新增 intent 必须先登记本表再入契约；\`catalog-data-ai.test.ts\` 与本脚本 \`--check\` 双向防止漂移。DOM 标注只含静态语义，**不含 PII**。

## 三件套

| 属性 | 来源 | 说明 |
| :--- | :--- | :--- |
| \`data-ai-role\` | \`contract.dataAi.role\` | 组件语义角色（= slug） |
| \`data-ai-state\` | \`contract.dataAi.states\` | 当前状态，值域为契约 states 子集 |
| \`data-ai-intent\` | \`contract.dataAi.intents[0]\` | 首要意图；完整意图集在契约中 |

## intent 词表（${sorted.length} 项）

| intent | 语义 |
| :--- | :--- |
${rows}
`

  if (checkOnly) {
    const [existingJson, existingMd] = await Promise.all([
      readFile(join(docsDir, 'data-ai-vocabulary.json'), 'utf8'),
      readFile(join(docsDir, 'data-ai-vocabulary.md'), 'utf8'),
    ])
    if (existingJson !== json) throw new Error('data-ai-vocabulary.json is stale; rerun generator')
    if (existingMd !== markdown) throw new Error('data-ai-vocabulary.md is stale; rerun generator')
    console.log('[vocabulary] docs/ai/data-ai-vocabulary.{json,md} up to date')
    return
  }

  await writeFile(join(docsDir, 'data-ai-vocabulary.json'), json, 'utf8')
  await writeFile(join(docsDir, 'data-ai-vocabulary.md'), markdown, 'utf8')
  console.log(`[vocabulary] wrote ${sorted.length} intents to docs/ai/`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
