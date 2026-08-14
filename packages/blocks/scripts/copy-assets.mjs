import { cp, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')
const distRoot = path.resolve(srcRoot, '..', 'dist')
const copyExt = new Set(['.css', '.json'])

async function copyAssets(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      await copyAssets(fullPath)
      continue
    }
    if (!copyExt.has(path.extname(entry.name))) continue
    const relativePath = path.relative(srcRoot, fullPath)
    const destination = path.join(distRoot, relativePath)
    await mkdir(path.dirname(destination), { recursive: true })
    await cp(fullPath, destination)
  }
}

await copyAssets(srcRoot)
