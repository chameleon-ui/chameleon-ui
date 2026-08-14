import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import { IotPanel } from './IotPanel.js'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('IotPanel', () => {
  it('renders device cards and acknowledges an alert', async () => {
    const user = userEvent.setup()
    const onAcknowledge = vi.fn()
    render(<IotPanel onAcknowledge={onAcknowledge} />)

    const root = document.querySelector('[data-ai-role="iot-panel"]')
    expect(root).toHaveAttribute('data-ai-intent', 'monitor-devices')
    expect(root).toHaveAttribute('data-ai-state', 'alert')
    expect(screen.getByRole('meter', { name: 'Load Chiller A' })).toBeInTheDocument()
    expect(screen.getByText('Alert')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Trend Pump B' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Acknowledge Pump B' }))
    expect(onAcknowledge).toHaveBeenCalledWith('bravo')
    expect(document.querySelector('[data-ai-role="iot-panel"]')).toHaveAttribute('data-ai-state', 'default')
  })

  it('renders the empty state when no devices are provided', () => {
    render(<IotPanel devices={[]} />)
    expect(screen.getByText('Connect a device to populate this panel.')).toBeInTheDocument()
    expect(document.querySelector('[data-ai-role="iot-panel"]')).toHaveAttribute('data-ai-state', 'empty')
  })

  it('formats ICU copy from authored locales', () => {
    expect(formatMessage('en', requireMessage(createCatalog(en), 'iot.deviceCount'), { count: 3 })).toBe('3 devices')
    expect(createCatalog(zhCN).get('iot.title')).toBe('设备面板')
  })

  it('inherits RTL from language without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<IotPanel locale="ar" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.querySelector('[data-ai-role="iot-panel"]')).not.toHaveAttribute('dir', 'ltr')
  })
})
