import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

test('@chameleon-ui/react package metadata', async () => {
  const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  assert.equal(pkg.name, '@chameleon-ui/react')
  assert.equal(pkg.version, '0.2.0')
  assert.ok(pkg.dependencies['@chameleon-ui/components'])
  assert.ok(pkg.exports['./css'])
})
