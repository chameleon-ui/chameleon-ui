/**
 * Emit a real CSS artifact for `@chameleon-ui/vue/css`.
 *
 * Consumers (and Vite) must resolve a .css file — not a JS re-export that
 * re-imports workspace packages. Bundle tokens + density + default `linear`
 * theme + components-vue base styles into dist/css.css. Also copy each theme
 * overlay into dist/themes/<id>.css for `@chameleon-ui/vue/themes/<id>/css`.
 *
 * Run after dependent packages are built (tokens, themes, components-vue).
 */
import { createRequire } from 'node:module'
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(join(root, 'package.json'))

const THEME_IDS = [
  'linear',
  'mercedes',
  'porsche',
  'ferrari',
  'apple',
  'tiktok',
  'wechat',
  'alipay',
]

function resolveCss(specifier) {
  try {
    return require.resolve(specifier)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(
      `[@chameleon-ui/vue] cannot resolve ${specifier} (${reason}). Build tokens/themes/components-vue first.`,
    )
  }
}

async function readCss(specifier) {
  return readFile(resolveCss(specifier), 'utf8')
}

const layers = [
  { label: '@chameleon-ui/tokens/css', specifier: '@chameleon-ui/tokens/css' },
  { label: '@chameleon-ui/tokens/density.css', specifier: '@chameleon-ui/tokens/density.css' },
  { label: '@chameleon-ui/themes/linear/css', specifier: '@chameleon-ui/themes/linear/css' },
  { label: '@chameleon-ui/components-vue/css', specifier: '@chameleon-ui/components-vue/css' },
]

const chunks = []
for (const layer of layers) {
  const css = await readCss(layer.specifier)
  if (!css.trim()) {
    throw new Error(`[@chameleon-ui/vue] empty CSS from ${layer.specifier}`)
  }
  chunks.push(`/* ${layer.label} */\n${css.trim()}`)
}

const distDir = join(root, 'dist')
const themesDir = join(distDir, 'themes')
await mkdir(themesDir, { recursive: true })

const cssOut = join(distDir, 'css.css')
await writeFile(cssOut, `${chunks.join('\n\n')}\n`)

for (const id of THEME_IDS) {
  const css = await readCss(`@chameleon-ui/themes/${id}/css`)
  await writeFile(join(themesDir, `${id}.css`), `${css.trim()}\n`)
}

await writeFile(
  join(distDir, 'css.d.ts'),
  '/** Side-effect CSS entry: tokens + density + line + components-vue. */\nexport {}\n',
)

// Drop legacy JS CSS entry artifacts if a previous build left them behind.
for (const stale of ['css.js', 'css.js.map', 'css.d.ts.map']) {
  try {
    await unlink(join(distDir, stale))
  } catch {
    // ignore missing
  }
}

const bytes = Buffer.byteLength(await readFile(cssOut))
console.log(
  `[@chameleon-ui/vue] wrote dist/css.css (${bytes} bytes) + dist/themes/{${THEME_IDS.length} ids}.css`,
)
