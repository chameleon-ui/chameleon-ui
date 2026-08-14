import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>
  status?: string
}

describe('primitives package boundary', () => {
  it('depends on Ark UI and does not keep the pending-M0 scaffold marker', () => {
    expect(manifest.status).toBeUndefined()
    expect(manifest.dependencies?.['@ark-ui/react']).toBeTruthy()
    expect(manifest.dependencies?.['@base-ui/react']).toBeUndefined()
  })
})
