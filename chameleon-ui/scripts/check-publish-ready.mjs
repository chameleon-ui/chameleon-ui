import { readdir, readFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(root, '..')
const packagesRoot = join(root, 'packages')

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

function fail(message) {
  console.error(`publish:check failed: ${message}`)
  process.exitCode = 1
}

const requiredFiles = [
  join(repoRoot, 'LICENSE'),
  join(repoRoot, 'CONTRIBUTING.md'),
  join(repoRoot, 'SECURITY.md'),
  join(root, 'LICENSE'),
  join(root, 'CONTRIBUTING.md'),
  join(root, 'SECURITY.md'),
]

for (const file of requiredFiles) {
  if (!(await exists(file))) fail(`missing ${file}`)
}

const rootPkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
if (rootPkg.private !== true) fail('chameleon-ui root must stay private')

const packageDirs = (await readdir(packagesRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

const publishable = []
for (const name of packageDirs) {
  const pkgPath = join(packagesRoot, name, 'package.json')
  if (!(await exists(pkgPath))) continue
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))
  if (pkg.private === true) continue
  publishable.push(pkg.name)
  if (pkg.license !== 'MIT') fail(`${pkg.name} license must be MIT`)
  if (pkg.publishConfig?.access !== 'public') fail(`${pkg.name} needs publishConfig.access=public`)
  if (!(await exists(join(packagesRoot, name, 'LICENSE')))) fail(`${pkg.name} missing LICENSE file`)
  if (pkg.version !== '0.0.0') {
    fail(`${pkg.name} is ${pkg.version}; first public tag is still v0.1.0. Do not pretend it was published.`)
  }
  if (pkg.engines?.node !== '>=20.19.0') {
    fail(`${pkg.name} engines.node must be >=20.19.0 (Node 18 is unsupported)`)
  }
}

const themeIds = [
  'line',
  'silver-arrow',
  'stuttgart',
  'corsa',
  'cupertino',
  'siren',
  'wechat',
  'ant-blue',
]
const themesPkg = JSON.parse(await readFile(join(packagesRoot, 'themes', 'package.json'), 'utf8'))
if (themesPkg.exports?.['./dist/*'] !== './dist/*') {
  fail('@chameleon-ui/themes must export ./dist/* so dist/<id>/variables.css specifiers resolve')
}
for (const id of themeIds) {
  if (themesPkg.exports?.[`./${id}/css`] !== `./dist/${id}/variables.css`) {
    fail(`@chameleon-ui/themes missing canonical CSS export ./${id}/css`)
  }
}

const tokensPkg = JSON.parse(await readFile(join(packagesRoot, 'tokens', 'package.json'), 'utf8'))
if (tokensPkg.exports?.['./css'] !== './dist/css/variables.css') {
  fail('@chameleon-ui/tokens missing canonical ./css export')
}
if (tokensPkg.exports?.['./dist/*'] !== './dist/*') {
  fail('@chameleon-ui/tokens must export ./dist/* so dist/css/variables.css specifiers resolve')
}

const appsRoot = join(root, 'apps')
for (const name of (await readdir(appsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)) {
  const pkg = JSON.parse(await readFile(join(appsRoot, name, 'package.json'), 'utf8'))
  if (pkg.private !== true) fail(`${pkg.name} must stay private`)
}

console.log(
  JSON.stringify(
    {
      plan: 'local-only',
      wouldPublish: publishable.sort(),
      firstTag: 'v0.1.0',
      npmPublish: false,
      note: 'pnpm publish -r is not run. workspace:* is rewritten to versions at publish. Pre-publish npm link of a single package fails; from chameleon-ui run node ./scripts/link-external.mjs (link all runtime packages).',
    },
    null,
    2,
  ),
)

if (process.exitCode) {
  process.exit(process.exitCode)
}
