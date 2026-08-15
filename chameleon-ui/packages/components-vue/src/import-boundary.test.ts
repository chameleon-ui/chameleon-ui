import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.')

describe('vue component package boundaries', () => {
  it('never imports @ark-ui or @base-ui from Vue component source', async () => {
    const files: string[] = []
    for await (const match of glob('**/*.{ts,vue,css}', { cwd: srcRoot })) {
      if (/\.test\./.test(match)) continue
      files.push(match)
    }

    const violations: string[] = []
    for (const relativePath of files) {
      const source = await readFile(path.join(srcRoot, relativePath), 'utf8')
      if (/(?:from|import)\s+['"]@(?:ark-ui|base-ui)\//.test(source)) {
        violations.push(relativePath)
      }
    }

    expect(violations, violations.join(', ')).toEqual([])
  }, 30_000)
})
