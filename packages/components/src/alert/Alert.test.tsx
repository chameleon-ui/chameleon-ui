import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Alert } from './Alert.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Alert', () => {
  it('renders a status alert with a title, description, and status data attribute', () => {
    render(<Alert description="Profile updated" status="success" title="Success" />)
    const alert = screen.getByRole('status')

    expect(alert).toHaveClass('cu-alert', 'cu-alert--success')
    expect(alert).toHaveAttribute('data-ai-role', 'alert')
    expect(alert).toHaveAttribute('data-ai-state', 'success')
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Profile updated')).toBeInTheDocument()
  })

  it('uses an alert role for errors', () => {
    render(<Alert description="Request failed" status="error" title="Error" />)
    expect(screen.getByRole('alert')).toHaveAttribute('data-ai-state', 'error')
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(<Alert description="تم تحديث الملف الشخصي" status="success" title={copy.get('alert.success') ?? ''} />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('status', { name: 'نجاح' })).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('alert.error')).toBe('Error')
    expect(createCatalog(de).get('alert.warning')).toBe('Warnhinweis anzeigen')
    expect(createCatalog(zhCN).get('alert.success')).toBe('成功')
  })
})
