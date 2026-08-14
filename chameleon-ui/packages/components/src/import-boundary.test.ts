import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.')

describe('component package boundaries', () => {
  it('never imports @ark-ui or @base-ui from component source', async () => {
    const files = []
    for await (const match of glob('**/*.{ts,tsx,css}', { cwd: srcRoot })) {
      if (/\.test\./.test(match) || match.startsWith('test/') || match.includes('\\test\\')) continue
      files.push(match)
    }

    const violations = []
    for (const relativePath of files) {
      const source = await readFile(path.join(srcRoot, relativePath), 'utf8')
      if (/(?:from|import)\s+['"]@(?:ark-ui|base-ui)\//.test(source)) {
        violations.push(relativePath)
      }
    }

    expect(violations, violations.join(', ')).toEqual([])
  })
})
