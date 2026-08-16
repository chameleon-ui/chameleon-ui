/**
 * Pack runtime packages to dist-tarballs/ without npm publish.
 *
 * Default: one umbrella fat tarball (`@chameleon-ui/react` or `--vue` → `@chameleon-ui/vue`)
 * that bundles the five underlying packages so a consumer installs **one** .tgz.
 *
 * Legacy: `--legacy-five` packs the five packages individually (old DX).
 *
 * Usage (from chameleon-ui/, after a workspace build):
 *   node ./scripts/pack-external.mjs
 *   node ./scripts/pack-external.mjs --vue
 *   node ./scripts/pack-external.mjs --legacy-five
 *   node ./scripts/pack-external.mjs --vue --legacy-five
 *   node ./scripts/pack-external.mjs --umbrella   # explicit; same as default
 */
import { spawn } from 'node:child_process'
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'dist-tarballs')
const vue = process.argv.includes('--vue')
const legacyFive = process.argv.includes('--legacy-five')
const umbrellaExplicit = process.argv.includes('--umbrella')
const umbrella = !legacyFive || umbrellaExplicit

const runtimePackages = vue
  ? ['tokens', 'i18n', 'primitives-vue', 'themes', 'components-vue']
  : ['tokens', 'i18n', 'primitives', 'themes', 'components-react']
const umbrellaName = vue ? 'vue' : 'react'
const umbrellaSpec = `@chameleon-ui/${umbrellaName}`

const version = JSON.parse(
  await readFile(join(root, 'packages', runtimePackages[0], 'package.json'), 'utf8'),
).version

function npmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited ${code}`))
    })
  })
}

function rewriteWorkspaceDeps(pkg) {
  const next = structuredClone(pkg)
  for (const field of ['dependencies', 'optionalDependencies']) {
    const block = next[field]
    if (!block || typeof block !== 'object') continue
    for (const [name, range] of Object.entries(block)) {
      if (typeof range === 'string' && range.startsWith('workspace:')) {
        block[name] = version
      }
    }
  }
  // Dev deps are omitted from pack via files/; drop workspace devDeps so npm
  // does not try to resolve them when installing a staged package.
  if (next.devDependencies) {
    for (const [name, range] of Object.entries(next.devDependencies)) {
      if (typeof range === 'string' && range.startsWith('workspace:')) {
        delete next.devDependencies[name]
      }
    }
  }
  return next
}

async function stagePackage(name) {
  const srcDir = join(root, 'packages', name)
  const staging = await mkdtemp(join(tmpdir(), `cu-pack-${name}-`))
  await cp(srcDir, staging, {
    recursive: true,
    filter: (src) => {
      const base = src.slice(srcDir.length).replace(/^[/\\]/, '')
      if (!base) return true
      const top = base.split(/[/\\]/)[0]
      return top !== 'node_modules' && top !== '.turbo'
    },
  })
  const pkgPath = join(staging, 'package.json')
  const pkg = rewriteWorkspaceDeps(JSON.parse(await readFile(pkgPath, 'utf8')))
  if (pkg.version !== version) {
    throw new Error(`version skew: ${pkg.name} is ${pkg.version}, expected ${version}`)
  }
  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
  return staging
}

async function packStaged(staging) {
  await run(npmCommand(), ['pack', '--pack-destination', outDir], staging)
  await rm(staging, { recursive: true, force: true })
}

function tarballName(npmName) {
  // @chameleon-ui/react → chameleon-ui-react-0.4.0.tgz
  return `${npmName.replace(/^@/, '').replace('/', '-')}-${version}.tgz`
}

await mkdir(outDir, { recursive: true })

const graphTarballNames = [
  ...runtimePackages.map((name) => tarballName(`@chameleon-ui/${name}`)),
  tarballName(umbrellaSpec),
]
for (const file of graphTarballNames) {
  await rm(join(outDir, file), { force: true })
}

console.log(
  legacyFive && !umbrellaExplicit
    ? `pack-external: legacy five-pack (${vue ? 'vue' : 'react'} graph)`
    : `pack-external: umbrella ${umbrellaSpec} (bundles five runtime packages)`,
)

for (const name of runtimePackages) {
  const staging = await stagePackage(name)
  await packStaged(staging)
}

if (umbrella) {
  const umbrellaStaging = await stagePackage(umbrellaName)
  const pkgPath = join(umbrellaStaging, 'package.json')
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))
  pkg.dependencies = Object.fromEntries(
    runtimePackages.map((name) => [`@chameleon-ui/${name}`, version]),
  )
  pkg.bundleDependencies = runtimePackages.map((name) => `@chameleon-ui/${name}`)
  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

  const tarballs = runtimePackages.map((name) =>
    join(outDir, tarballName(`@chameleon-ui/${name}`)),
  )
  await run(
    npmCommand(),
    ['install', '--omit=dev', '--legacy-peer-deps', ...tarballs],
    umbrellaStaging,
  )
  await packStaged(umbrellaStaging)

  if (!legacyFive) {
    // Keep only the umbrella tarball as the consumer-facing artifact.
    for (const name of runtimePackages) {
      await rm(join(outDir, tarballName(`@chameleon-ui/${name}`)), { force: true })
    }
  }
}

const files = (await readdir(outDir)).filter((file) => file.endsWith('.tgz')).sort()
console.log('')
console.log(`pack-external: wrote ${files.length} tarball(s) (v${version}) to ${outDir}`)
for (const file of files) console.log(`- ${file}`)
console.log('This is not npm publish. Tarball/pack is the supported pre-registry path.')
console.log('In the consumer:')
if (umbrella && !legacyFive) {
  console.log(`  npm install <path-to>/${tarballName(umbrellaSpec)}`)
  console.log(
    vue
      ? 'One package: @chameleon-ui/vue (bundles the Vue graph). Prefer templates/external-vite-vue.'
      : 'One package: @chameleon-ui/react (bundles the React graph). Prefer templates/external-vite-react.',
  )
  console.log('Pass --legacy-five to also keep individual five-pack tarballs.')
} else if (legacyFive && umbrellaExplicit) {
  console.log(`  npm install <path-to>/${tarballName(umbrellaSpec)}`)
  console.log('  (or install the five individual tarballs for legacy setups)')
} else {
  console.log('  npm install <path-to-each>.tgz')
  console.log(
    vue
      ? 'Install tokens + i18n + primitives-vue + themes + components-vue. Prefer templates/external-vite-vue.'
      : 'Install all five. Prefer templates/external-vite-react. Default pack is --umbrella (one install).',
  )
}
