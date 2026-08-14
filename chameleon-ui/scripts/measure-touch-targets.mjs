/**
 * Phase 5 T5.7 / A5.6 — compute the touch-target floor from compiled tokens
 * and scan the Phase 5 本期清单 CSS for min tap sizes.
 *
 * This is a CSS-token computation + static scan. It does not run Lighthouse,
 * Playwright, or a browser. Do not treat the output as a runtime a11y audit.
 */
import { access, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(root, '..')
const reportMd = join(repoRoot, 'docs/project/reports/Phase-5-触控目标测量.md')
const reportJson = join(repoRoot, 'docs/project/reports/Phase-5-触控目标测量.json')

const ROOT_FONT_PX = 16
const REQUIRED_PX = 44
const TOUCH_VAR = '--cu-touch-target-min'
const CONTROL_ACTIVE_VAR = '--cu-control-size-active'
const CONTROL_COMFORTABLE_VAR = '--cu-control-size-comfortable'

/** Phase 5 §3.7 本期清单: 新组件 ×4 + §0.5 改造清单. */
const PHASE5_SCOPE = [
  { slug: 'action-sheet', kind: 'new' },
  { slug: 'tab-bar', kind: 'new' },
  { slug: 'safe-area', kind: 'new' },
  { slug: 'sidebar', kind: 'new' },
  { slug: 'checkbox', kind: '改造' },
  { slug: 'app-shell', kind: '改造' },
  { slug: 'dialog', kind: '改造' },
  { slug: 'select', kind: '改造' },
  { slug: 'switch', kind: '改造' },
  { slug: 'button', kind: '改造' },
  { slug: 'table', kind: '改造' },
  { slug: 'radio', kind: '改造' },
  { slug: 'spinner', kind: '改造' },
  { slug: 'tabs', kind: '改造' },
  { slug: 'skeleton', kind: '改造' },
]

/** Only min-* sizes are tap floors. block-size/inline-size are glyphs/layout. */
const TAP_FLOOR_DECL = /min-(?:block|inline)-size\s*:\s*([^;]+);/g

function fail(message) {
  console.error(`measure-touch-targets failed: ${message}`)
  process.exitCode = 1
}

async function exists(target) {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

function parseLengthToPx(raw, tokensPx) {
  const value = raw.trim()
  if (value.startsWith('var(')) {
    const inner = value.slice(4, -1).trim().split(',')[0].trim()
    if (inner in tokensPx) return { px: tokensPx[inner], source: `var(${inner})` }
    return { px: null, source: value, note: `unresolved custom property ${inner}` }
  }
  const rem = value.match(/^(-?\d+(?:\.\d+)?)rem$/)
  if (rem) {
    return { px: Number(rem[1]) * ROOT_FONT_PX, source: value }
  }
  const px = value.match(/^(-?\d+(?:\.\d+)?)px$/)
  if (px) {
    return { px: Number(px[1]), source: value }
  }
  return { px: null, source: value, note: 'not a rem/px/var() length (layout or calc)' }
}

function parseCssCustomProperties(css) {
  const map = {}
  const re = /(--cu-[a-z0-9-]+)\s*:\s*([^;]+);/g
  let match
  while ((match = re.exec(css))) {
    map[match[1]] = match[2].trim()
  }
  return map
}

function remToPx(cssValue) {
  const rem = String(cssValue).trim().match(/^(-?\d+(?:\.\d+)?)rem$/)
  if (!rem) return null
  return Number(rem[1]) * ROOT_FONT_PX
}

async function collectCssFiles(directory) {
  if (!(await exists(directory))) return []
  const files = []
  const entries = await readdir(directory, { withFileTypes: true, recursive: true })
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.css')) continue
    files.push(join(entry.parentPath ?? directory, entry.name))
  }
  return files.sort((a, b) => a.localeCompare(b, 'en'))
}

function scanCss(css, tokensPx, fileLabel) {
  const decls = []
  let match
  const re = new RegExp(TAP_FLOOR_DECL.source, 'g')
  while ((match = re.exec(css))) {
    const parsed = parseLengthToPx(match[1], tokensPx)
    decls.push({
      file: fileLabel,
      property: match[0].split(':')[0].trim(),
      raw: match[1].trim(),
      ...parsed,
    })
  }
  return decls
}

function classifyComponent(decls) {
  const tapDecls = decls.filter((d) => d.px !== null)
  const usesTouchToken = decls.some((d) => d.source.includes(TOUCH_VAR))
  const usesControlActive = decls.some((d) => d.source.includes(CONTROL_ACTIVE_VAR))
  if (tapDecls.length === 0) {
    return {
      status: 'n/a',
      reason: 'no rem/px/token min tap size (layout wrapper or non-interactive)',
      usesTouchToken,
      usesControlActive,
    }
  }
  const minPx = Math.min(...tapDecls.map((d) => d.px))
  if (minPx >= REQUIRED_PX) {
    return { status: 'pass', reason: `min computed tap ${minPx}px >= ${REQUIRED_PX}px`, usesTouchToken, usesControlActive, minPx }
  }
  return {
    status: 'below-floor',
    reason: `min computed tap ${minPx}px < ${REQUIRED_PX}px (token floor is ${REQUIRED_PX}px @ ${ROOT_FONT_PX}px root)`,
    usesTouchToken,
    usesControlActive,
    minPx,
  }
}

function renderMarkdown(report) {
  const rows = report.components
    .map((c) => {
      const min = c.minPx == null ? '—' : `${c.minPx}px`
      return `| ${c.slug} | ${c.kind} | ${c.status} | ${min} | ${c.reason} |`
    })
    .join('\n')

  return `# Phase 5 · 触控目标测量（T5.7 / A5.6）

> 日期：${report.generatedAt}  
> 方法：**CSS Token 计算 + 本期清单静态扫描**。未跑 Lighthouse / 未开浏览器 / 无运行时命中测试。  
> 根字号假设：\`html\` 初始 \`font-size\` = **${ROOT_FONT_PX}px**（CSS initial；与愿景 §7.1「44px」换算一致）。  
> Owner：待指定。禁止把本文件写成 Lighthouse 分数或全库达标证明。

## 1. Token 地板（权威源）

| 变量 | 编译值 | @${ROOT_FONT_PX}px root |
| :--- | :--- | :--- |
| \`${TOUCH_VAR}\` | \`${report.tokens.css[TOUCH_VAR]}\` | **${report.tokens.touchTargetMinPx}px** |
| \`${CONTROL_COMFORTABLE_VAR}\` | \`${report.tokens.css[CONTROL_COMFORTABLE_VAR]}\` | ${report.tokens.controlComfortablePx}px |
| \`${CONTROL_ACTIVE_VAR}\`（variables.css 默认 = standard） | \`${report.tokens.css[CONTROL_ACTIVE_VAR]}\` | ${report.tokens.controlActiveDefaultPx}px（桌面未覆盖） |
| \`${CONTROL_ACTIVE_VAR}\` @ mobile（density.css → comfortable） | \`${report.tokens.css[CONTROL_COMFORTABLE_VAR]}\` | ${report.tokens.controlActiveMobilePx}px |

- 愿景 §7.1 / density.json：\`touch-target.min\` = 2.75rem → ${report.tokens.touchTargetMinPx}px。
- \`density.css\` 在 mobile（\`max-width: 47.99rem\`）把 \`${CONTROL_ACTIVE_VAR}\` 重指向 comfortable（${report.tokens.controlComfortablePx}px）。扫描按**移动端**解析该变量。桌面 compact 为 2.25rem = 36px，**不是**触控地板。
- 只把 \`min-block-size\` / \`min-inline-size\` 算作 tap 地板；装饰性 \`block-size\`（如 action-sheet 把手条 0.25rem、spinner 图标）不计。
- 本记录证明 Token 地板为 ${report.tokens.touchTargetMinPx}px，**不是**抽检每个像素的运行时测量。

## 2. 本期清单覆盖（100% 扫描）

新组件 ×4 + §0.5 改造清单。\`status=n/a\` 表示该 slug 无独立 tap 控件（例如 safe-area / spinner / skeleton）。\`below-floor\` 是硬编码小于 2.75rem 的声明，**未改 P6 组件**。

| slug | 范围 | 结果 | 最小计算 tap | 说明 |
| :--- | :--- | :--- | :--- | :--- |
${rows}

- 覆盖 ${report.coverage.scanned}/${report.coverage.listed} 个清单项（缺文件则失败）。
- 消费 \`${TOUCH_VAR}\` 的 tap 面按 Token 计算为 ${report.tokens.touchTargetMinPx}px。
- 未宣称全库达标；范围外组件不在本表。

## 3. 明确未做

- 无 Lighthouse / LHCI 分数。
- 无 Playwright 点击热区截图。
- 未改 P6 组件把 2.25rem 控件抬到 44px。
- 虚拟键盘遮挡仍以既有 input 演示页回归，本脚本不测。

## 4. 复现

\`\`\`
corepack pnpm@9.15.0 --filter @chameleon-ui/tokens build
node ./scripts/measure-touch-targets.mjs
\`\`\`
`
}

async function main() {
  const variablesPath = join(root, 'packages/tokens/dist/css/variables.css')
  const densityPath = join(root, 'packages/tokens/dist/css/density.css')
  const tokensJsonPath = join(root, 'packages/tokens/dist/tokens.json')

  for (const file of [variablesPath, densityPath, tokensJsonPath]) {
    if (!(await exists(file))) {
      fail(`missing ${file}; run pnpm --filter @chameleon-ui/tokens build`)
      return
    }
  }

  const variablesCss = await readFile(variablesPath, 'utf8')
  const densityCss = await readFile(densityPath, 'utf8')
  const tokensJson = JSON.parse(await readFile(tokensJsonPath, 'utf8'))
  const cssVars = parseCssCustomProperties(variablesCss)

  if (cssVars[TOUCH_VAR] !== '2.75rem') {
    fail(`${TOUCH_VAR} must be 2.75rem, got ${cssVars[TOUCH_VAR]}`)
  }
  if (tokensJson['touch-target.min'] !== '2.75rem') {
    fail(`tokens.json touch-target.min must be 2.75rem, got ${tokensJson['touch-target.min']}`)
  }

  const touchTargetMinPx = remToPx(cssVars[TOUCH_VAR])
  const controlComfortablePx = remToPx(cssVars[CONTROL_COMFORTABLE_VAR])
  const controlActiveDefaultPx = remToPx(cssVars[CONTROL_ACTIVE_VAR])

  if (touchTargetMinPx == null) {
    fail(`cannot convert ${TOUCH_VAR}=${cssVars[TOUCH_VAR]} to px`)
    return
  }
  if (touchTargetMinPx < REQUIRED_PX) {
    fail(`token floor ${touchTargetMinPx}px < ${REQUIRED_PX}px`)
  }

  // 本期清单验收的是移动端：density.css 把 --cu-control-size-active
  // 指到 comfortable（2.75rem）。variables.css 默认 standard（2.5rem）是桌面/未加载 density 时的值。
  const controlActiveMobilePx = controlComfortablePx
  const tokensPx = {
    [TOUCH_VAR]: touchTargetMinPx,
    [CONTROL_COMFORTABLE_VAR]: controlComfortablePx,
    [CONTROL_ACTIVE_VAR]: controlActiveMobilePx,
    '--cu-control-size-compact': remToPx(cssVars['--cu-control-size-compact']),
    '--cu-control-size-standard': remToPx(cssVars['--cu-control-size-standard']),
  }

  const components = []
  for (const item of PHASE5_SCOPE) {
    const dir = join(root, 'packages/components/src', item.slug)
    const files = await collectCssFiles(dir)
    if (files.length === 0) {
      fail(`本期清单 missing CSS for ${item.slug}`)
      components.push({
        ...item,
        status: 'missing',
        reason: 'styles.css not found',
        decls: [],
      })
      continue
    }
    const decls = []
    for (const file of files) {
      const css = await readFile(file, 'utf8')
      decls.push(...scanCss(css, tokensPx, relative(root, file).replaceAll('\\', '/')))
    }
    const classified = classifyComponent(decls)
    components.push({ ...item, ...classified, decls })
  }

  const vueButtonDir = join(root, 'packages/components-vue/src/button')
  if (await exists(vueButtonDir)) {
    const files = await collectCssFiles(vueButtonDir)
    const decls = []
    for (const file of files) {
      const css = await readFile(file, 'utf8')
      decls.push(...scanCss(css, tokensPx, relative(root, file).replaceAll('\\', '/')))
    }
    const classified = classifyComponent(decls)
    components.push({ slug: 'button (vue)', kind: '改造-vue', ...classified, decls })
  }

  const listed = PHASE5_SCOPE.length
  const scoped = components.filter((c) => c.kind !== '改造-vue')
  const scanned = scoped.filter((c) => c.status !== 'missing').length
  if (scanned < listed) fail(`本期清单 coverage ${scanned}/${listed}`)

  const report = {
    generatedAt: '2026-08-13',
    method: 'css-token-computation+static-scan',
    lighthouse: false,
    rootFontPx: ROOT_FONT_PX,
    requiredPx: REQUIRED_PX,
    tokens: {
      css: {
        [TOUCH_VAR]: cssVars[TOUCH_VAR],
        [CONTROL_COMFORTABLE_VAR]: cssVars[CONTROL_COMFORTABLE_VAR],
        [CONTROL_ACTIVE_VAR]: cssVars[CONTROL_ACTIVE_VAR],
      },
      json: { 'touch-target.min': tokensJson['touch-target.min'] },
      touchTargetMinPx,
      controlComfortablePx,
      controlActiveDefaultPx,
      controlActiveMobilePx,
      densityCssMentionsActive:
        densityCss.includes(CONTROL_ACTIVE_VAR) && densityCss.includes('--cu-density-active'),
    },
    coverage: { listed, scanned },
    components: components.map(({ decls, ...rest }) => ({
      ...rest,
      declCount: decls.length,
      decls: decls.map(({ file, property, raw, px, source }) => ({
        file,
        property,
        raw,
        px,
        source,
      })),
    })),
  }

  await writeFile(reportJson, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  await writeFile(reportMd, renderMarkdown(report), 'utf8')

  console.log(
    JSON.stringify(
      {
        ok: process.exitCode ? false : true,
        touchTargetMinPx,
        requiredPx: REQUIRED_PX,
        coverage: `${scanned}/${listed}`,
        reportMd: relative(repoRoot, reportMd).replaceAll('\\', '/'),
        reportJson: relative(repoRoot, reportJson).replaceAll('\\', '/'),
        belowFloor: components.filter((c) => c.status === 'below-floor').map((c) => c.slug),
        note: 'Computed from --cu-touch-target-min=2.75rem at 16px root. No Lighthouse.',
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
