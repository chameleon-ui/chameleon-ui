import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')
const distRoot = path.resolve(srcRoot, '..', 'dist')

/** @type {string[]} */
const stylesPaths = []

async function copyCss(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      await copyCss(fullPath)
      continue
    }
    if (!entry.name.endsWith('.css')) continue
    const relativePath = path.relative(srcRoot, fullPath)
    const destination = path.join(distRoot, relativePath)
    await mkdir(path.dirname(destination), { recursive: true })
    await cp(fullPath, destination)
    if (entry.name === 'styles.css') {
      stylesPaths.push(fullPath)
    }
  }
}

await copyCss(srcRoot)

stylesPaths.sort((a, b) => path.relative(srcRoot, a).localeCompare(path.relative(srcRoot, b)))

if (stylesPaths.length === 0) {
  throw new Error('[@chameleon-ui/components-react] no styles.css files found to bundle')
}

const chunks = []
for (const filePath of stylesPaths) {
  const relative = path.relative(srcRoot, filePath).split(path.sep).join('/')
  const css = (await readFile(filePath, 'utf8')).trim()
  if (!css) {
    throw new Error(`[@chameleon-ui/components-react] empty CSS: ${relative}`)
  }
  chunks.push(`/* ${relative} */\n${css}`)
}

const indexCss = `${chunks.join('\n\n')}\n`
await writeFile(path.join(distRoot, 'index.css'), indexCss)
console.log(
  `[@chameleon-ui/components-react] wrote dist/index.css (${Buffer.byteLength(indexCss)} bytes, ${stylesPaths.length} stylesheets)`,
)
