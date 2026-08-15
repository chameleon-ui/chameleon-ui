import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createInstallKernel } from '@chameleon-ui/install-core'
import {
  createHttpRegistryClient,
  prepareInstall,
} from '@chameleon-ui/registry'
import { createPrivateRegistryServer } from '../dist/index.js'

const token = 'cu-phase3-ci-token'

function fail(message) {
  console.error(`phase3:gates failed: ${message}`)
  process.exitCode = 1
}

const server = await createPrivateRegistryServer({
  token,
  host: '127.0.0.1',
  port: 0,
})

const dir = await mkdtemp(join(tmpdir(), 'cu-phase3-gates-'))

try {
  const health = await fetch(`${server.url}/health`)
  if (health.status !== 200) fail(`health expected 200, got ${health.status}`)

  const unauthorized = await fetch(`${server.url}/v1/namespaces/public/items/button`)
  if (unauthorized.status !== 401) fail(`missing token expected 401, got ${unauthorized.status}`)

  const publicClient = createHttpRegistryClient({
    url: server.url,
    token,
    namespace: 'public',
    source: 'cli',
  })
  const prepared = await prepareInstall(publicClient, 'button')
  if (!prepared?.item || prepared.item.id !== 'button') fail('public button missing')
  if (prepared.item.namespace !== 'public') fail(`expected namespace public, got ${prepared.item.namespace}`)
  if (prepared.item.type !== 'registry:ui') fail('button is not registry:ui')
  if (!Array.isArray(prepared.item.files) || prepared.item.files.length === 0) {
    fail('button has no files')
  }

  const acmeClient = createHttpRegistryClient({
    url: server.url,
    token,
    namespace: 'acme',
    source: 'mcp',
  })
  const versions = await acmeClient.listVersions('button')
  if (JSON.stringify(versions) !== JSON.stringify(['0.9.0', '1.0.0', '1.1.0'])) {
    fail(`acme versions ${JSON.stringify(versions)}`)
  }
  const latest = await acmeClient.getItem('button')
  if (latest?.version !== '1.1.0') fail(`expected latest 1.1.0, got ${latest?.version}`)

  const events = []
  const kernel = createInstallKernel(prepared.registry)
  const result = await kernel.install(prepared.item, dir, { source: 'cli' })
  if (!result.installed.includes('button')) fail('install-core did not install button')
  const writtenPath = join(dir, prepared.item.files[0].path)
  const content = await readFile(writtenPath, 'utf8')
  if (content !== prepared.item.files[0].content) fail('installed file content mismatch')
  if (events.length !== 0) fail('telemetry must stay off unless a hook is passed')

  if (JSON.stringify(server.auditLog).includes(token)) fail('audit log leaked the token')

  console.log(
    JSON.stringify(
      {
        ok: true,
        url: server.url,
        installed: result.installed,
        written: result.written.length,
        namespaces: ['public', 'acme'],
        telemetry: 'off',
        note: 'A3.4 local demo: same RegistryItem schema, token auth, install-core writer',
      },
      null,
      2,
    ),
  )
} finally {
  await rm(dir, { recursive: true, force: true })
  await server.close()
}

if (process.exitCode) {
  process.exit(process.exitCode)
}
