#!/usr/bin/env node
/**
 * Opens the internal-demo blind harness URL.
 * One-command human path (from chameleon-ui/):
 *   corepack pnpm@9.15.0 demo:blind
 * Prefer running `pnpm demo` in another terminal first, or pass --with-demo.
 */
import { spawn } from 'node:child_process'
import { createConnection } from 'node:net'
import { platform } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const URL = 'http://127.0.0.1:5175/?view=blind&locale=en'
const HOST = '127.0.0.1'
const PORT = 5175
const withDemo = process.argv.includes('--with-demo')

function canConnect(host, port, timeoutMs = 400) {
  return new Promise((resolve) => {
    const socket = createConnection({ host, port })
    const done = (ok) => {
      socket.destroy()
      resolve(ok)
    }
    socket.setTimeout(timeoutMs)
    socket.once('connect', () => done(true))
    socket.once('timeout', () => done(false))
    socket.once('error', () => done(false))
  })
}

function openBrowser(url) {
  const os = platform()
  if (os === 'win32') {
    spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref()
    return
  }
  if (os === 'darwin') {
    spawn('open', [url], { detached: true, stdio: 'ignore' }).unref()
    return
  }
  spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref()
}

async function waitForPort(host, port, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    if (await canConnect(host, port)) return true
    await new Promise((r) => setTimeout(r, 500))
  }
  return false
}

console.log('Blind harness URL:', URL)
console.log('Protocol: docs/project/reports/盲测协议.md')
console.log('Operator kit: docs/project/reports/2026-08-15-blind-test-operator-kit.md')
console.log('Do not invent recognition rates. Export JSON after a real human session.')

let ready = await canConnect(HOST, PORT)

if (!ready && withDemo) {
  console.log('Starting demo (`pnpm demo`)…')
  const child = spawn(
    process.platform === 'win32' ? 'corepack.cmd' : 'corepack',
    ['pnpm@9.15.0', 'demo'],
    { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' },
  )
  ready = await waitForPort(HOST, PORT)
  if (!ready) {
    console.error('Demo did not become ready on :5175')
    child.kill()
    process.exit(1)
  }
  openBrowser(URL)
  console.log('Browser open requested. Demo keeps running in this terminal (Ctrl+C to stop).')
  process.on('SIGINT', () => {
    child.kill()
    process.exit(0)
  })
  await new Promise(() => {})
}

if (!ready) {
  console.log('Demo is not listening on :5175 yet.')
  console.log('In another terminal: corepack pnpm@9.15.0 demo')
  console.log('Or re-run: corepack pnpm@9.15.0 demo:blind -- --with-demo')
  openBrowser(URL)
  process.exit(0)
}

openBrowser(URL)
console.log('Browser open requested.')
