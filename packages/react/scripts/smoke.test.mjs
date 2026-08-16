import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(join(root, 'package.json'))

function cssExportTarget(entry) {
  if (typeof entry === 'string') return entry
  if (entry && typeof entry === 'object') {
    return entry.style ?? entry.default ?? entry.import
  }
  return undefined
}

test('@chameleon-ui/react package metadata', async () => {
  const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  assert.equal(pkg.name, '@chameleon-ui/react')
  assert.equal(pkg.version, '0.4.0')
  assert.ok(pkg.dependencies['@chameleon-ui/components-react'])
  assert.equal(cssExportTarget(pkg.exports['./css']), './dist/css.css')
  assert.ok(pkg.exports['./themes/*/css'])
})

test('@chameleon-ui/react/css is a real CSS file with tokens + density + line + components', async () => {
  const cssPath = join(root, 'dist', 'css.css')
  await access(cssPath)
  const css = await readFile(cssPath, 'utf8')
  assert.match(css, /--cu-color-fg-default/)
  assert.match(css, /--cu-density-active/)
  assert.match(css, /--cu-control-size-active/)
  assert.match(css, /cu-effects:line|\.cu-app-shell\b|--cu-border-width-hairline/)
  assert.match(css, /\.cu-button\b/)
  assert.ok(css.length > 10_000, `expected substantial CSS, got ${css.length} chars`)

  const resolved = require.resolve('@chameleon-ui/react/css')
  assert.equal(resolved, cssPath)

  for (const id of ['linear', 'apple', 'wechat']) {
    const themePath = join(root, 'dist', 'themes', `${id}.css`)
    await access(themePath)
    const themeResolved = require.resolve(`@chameleon-ui/react/themes/${id}/css`)
    assert.equal(themeResolved, themePath)
  }
})
