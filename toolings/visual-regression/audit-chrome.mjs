import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as sleep } from 'node:timers/promises'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const port = 9333
const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.tmp-chrome-audit')
const profile = path.join(outDir, `cdp-profile-${Date.now()}`)
mkdirSync(profile, { recursive: true })

function payload(raw) {
  const data = raw?.data ?? raw
  return typeof data === 'string' ? data : Buffer.from(data).toString('utf8')
}

function connect(url) {
  const ws = new WebSocket(url)
  let nextId = 1
  const pending = new Map()
  ws.addEventListener('message', (raw) => {
    const msg = JSON.parse(payload(raw))
    if (msg.id == null) return
    const waiter = pending.get(msg.id)
    if (!waiter) return
    pending.delete(msg.id)
    if (msg.error) waiter.reject(new Error(JSON.stringify(msg.error)))
    else waiter.resolve(msg.result)
  })
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve)
    ws.addEventListener('error', reject)
  })
  return {
    ready,
    close: () => ws.close(),
    call(method, params = {}) {
      const id = nextId++
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject })
        ws.send(JSON.stringify({ id, method, params }))
      })
    },
  }
}

async function jsonGet(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} ${res.status}`)
  return res.json()
}

const chrome = spawn(
  chromePath,
  [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

let failed = false
try {
  let pages
  for (let i = 0; i < 40; i += 1) {
    try {
      pages = await jsonGet(`http://127.0.0.1:${port}/json/list`)
      if (Array.isArray(pages) && pages.some((item) => item.webSocketDebuggerUrl)) break
    } catch {
      pages = null
    }
    await sleep(150)
  }
  const page = pages?.find((item) => item.type === 'page' && item.webSocketDebuggerUrl)
  if (!page) throw new Error(`no page target: ${JSON.stringify(pages)}`)

  const session = connect(page.webSocketDebuggerUrl)
  await session.ready
  await session.call('Page.enable')
  await session.call('Runtime.enable')

  await session.call('Page.navigate', { url: 'http://127.0.0.1:5175/?locale=zh-CN&theme=line' })

  async function waitForShell() {
    for (let i = 0; i < 25; i += 1) {
      const probe = await session.call('Runtime.evaluate', {
        returnByValue: true,
        expression: `Boolean(document.querySelector('[data-ai-role="app-shell"]'))`,
      })
      if (probe.result.value) return
      await sleep(200)
    }
    throw new Error('app-shell did not mount')
  }

  await waitForShell()

  async function audit(label, width, height, mobile) {
    await session.call('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
    })
    await sleep(400)
    await waitForShell()
    const result = await session.call('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const box = (el) => {
          if (!el) return null
          const r = el.getBoundingClientRect()
          return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom), right: Math.round(r.right) }
        }
        return {
          viewport: { w: window.innerWidth, h: window.innerHeight },
          nav: box(document.querySelector('[data-ai-role="navigation"]')),
          navSlot: box(document.querySelector('.cu-app-shell__nav')),
          bar: box(document.querySelector('[data-ai-role="navigation-bar"]')),
          shell: box(document.querySelector('[data-ai-role="app-shell"]')),
          main: box(document.querySelector('.cu-app-shell__main')),
          inspector: box(document.querySelector('.cu-demo-inspector')),
          labels: [...document.querySelectorAll('.cu-navigation__item .cu-navigation__label')].map((n) => n.textContent.trim()).slice(0, 8),
        }
      })()`,
    })
    const data = result.result.value
    const shot = await session.call('Page.captureScreenshot', { format: 'png' })
    writeFileSync(path.join(outDir, `${label}.png`), Buffer.from(shot.data, 'base64'))
    writeFileSync(path.join(outDir, `${label}.json`), JSON.stringify(data, null, 2))
    console.log(`\n=== ${label} ===`)
    console.log(JSON.stringify(data, null, 2))

    const navBox = data.navSlot || data.nav
    const vp = data.viewport
    if (!navBox || navBox.h < 24) {
      failed = true
      console.error(`${label}: navigation missing or too short`)
    } else if (navBox.y < -1 || navBox.bottom > vp.h + 2 || navBox.x < -1 || navBox.right > vp.w + 2) {
      failed = true
      console.error(`${label}: navigation off-screen`, navBox, 'viewport', vp)
    } else if (!data.bar || data.bar.h < 24 || data.bar.y < -1 || data.bar.bottom > vp.h + 2) {
      failed = true
      console.error(`${label}: navigation-bar off-screen`, data.bar)
    } else {
      console.log(`${label}: chrome on-screen`)
    }
    return data
  }

  const phone = await audit('phone-390', 390, 844, true)
  const desktop = await audit('desktop-1440', 1440, 900, false)

  if (phone.nav && phone.viewport.w <= 430 && phone.nav.y < phone.viewport.h * 0.7) {
    failed = true
    console.error('phone-390: expected tab bar near the bottom, got y=', phone.nav.y)
  }
  if (desktop.nav && desktop.viewport.w >= 1000 && desktop.nav.x > 80) {
    failed = true
    console.error('desktop-1440: expected left sidebar, got x=', desktop.nav.x)
  }

  session.close()
} finally {
  chrome.kill()
}

if (failed) {
  console.error('\nVISUAL AUDIT FAILED')
  process.exit(1)
}
console.log('\nVISUAL AUDIT PASSED')
