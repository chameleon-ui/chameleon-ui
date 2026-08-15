import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runHarness, type BenchReport } from './run.js'

const reportsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'reports')

function toMarkdown(report: BenchReport): string {
  const rows = report.metrics
    .map((metric) => {
      const value = metric.value === null ? 'null (reserved)' : metric.value.toFixed(4)
      return `| \`${metric.id}\` | ${value} | ${metric.successes}/${metric.attempts} | ${metric.note} |`
    })
    .join('\n')

  let generationSection = ''
  if (report.generation) {
    const generation = report.generation
    const outcomeRows = generation.outcomes
      .map(
        (outcome) =>
          `| ${outcome.taskId} | ${outcome.passed ? 'pass' : 'fail'} | ${outcome.compileOk} | ${outcome.coversExpected} | ${outcome.installOk} | ${outcome.selectedSlugs.join(', ')} |`,
      )
      .join('\n')
    generationSection = `
## Generation quality detail (Phase 8 A6)

Generator: ${generation.generator ?? 'none configured (honest null)'}
Task set: v${generation.taskSetVersion} · Measured at: ${generation.measuredAt}

${
  generation.outcomes.length > 0
    ? `| Task | Pass | Compile | Covers | Install | Slugs |
| :--- | :--- | :--- | :--- | :--- | :--- |
${outcomeRows}`
    : 'No outcomes: generator not configured. Set CU_BENCH_GENERATOR to measure.'
}
`
  }

  return `# GenUI-Bench report

Generated: ${report.generatedAt}

Registry: ${report.registry.components} components, ${report.registry.themes} themes, ${report.registry.blocks} blocks.

Telemetry default off: ${report.telemetryDefaultOff}

| Metric | Value | n | Note |
| :--- | :--- | :--- | :--- |
${rows}
${generationSection}
## Reproduce

\`\`\`
cd chameleon-ui
corepack pnpm@9.15.0 bench:genui
# generation_quality measurement (optional, needs a generator):
#   CU_BENCH_GENERATOR=template-baseline pnpm bench:genui
\`\`\`

This file is produced by the harness. Do not hand-edit numbers.
`
}

function toHtml(report: BenchReport): string {
  const rows = report.metrics
    .map((metric) => {
      const value = metric.value === null ? 'null (reserved)' : metric.value.toFixed(4)
      return `<tr><td><code>${metric.id}</code></td><td>${value}</td><td>${metric.successes}/${metric.attempts}</td><td>${metric.note}</td></tr>`
    })
    .join('')
  const generation = report.generation
  const generationBlock = generation
    ? `<h2>Generation quality (A6)</h2>
    <p>Generator: <code>${generation.generator ?? 'none configured (honest null)'}</code></p>
    <p>Task set: v${generation.taskSetVersion} · Measured at: <time>${generation.measuredAt}</time></p>
    <p>${generation.note}</p>`
    : ''
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>GenUI-Bench</title>
  </head>
  <body>
    <h1>GenUI-Bench</h1>
    <p>Generated ${report.generatedAt}. Registry ${report.registry.components} components / ${report.registry.themes} themes / ${report.registry.blocks} blocks.</p>
    <table>
      <thead><tr><th>Metric</th><th>Value</th><th>n</th><th>Note</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${generationBlock}
    <h2>Reproduce</h2>
    <pre>cd chameleon-ui
corepack pnpm@9.15.0 bench:genui
# optional measured generation_quality:
#   CU_BENCH_GENERATOR=template-baseline corepack pnpm@9.15.0 bench:genui</pre>
  </body>
</html>
`
}

function assertRates(report: BenchReport): void {
  const failed = report.metrics.filter(
    (metric) => metric.unit === 'rate' && metric.value !== 1,
  )
  if (!report.telemetryDefaultOff) {
    failed.push({
      id: 'bench.install_success_rate',
      value: 0,
      unit: 'rate',
      successes: 0,
      attempts: 0,
      note: 'Telemetry fired without a hook.',
    })
  }
  if (failed.length > 0) {
    const detail = failed.map((metric) => `${metric.id}=${metric.value}`).join(', ')
    throw new Error(`GenUI-Bench gate failed: ${detail}`)
  }
}

const report = await runHarness()
await mkdir(reportsDir, { recursive: true })
await writeFile(join(reportsDir, 'latest.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8')
await writeFile(join(reportsDir, 'latest.md'), toMarkdown(report), 'utf8')
await writeFile(join(reportsDir, 'index.html'), toHtml(report), 'utf8')
console.log(JSON.stringify(report, null, 2))
assertRates(report)
