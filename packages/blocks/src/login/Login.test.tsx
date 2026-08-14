import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import { Login } from './Login.js'
import { loginLocaleTrees } from './locale-map.js'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Login', () => {
  it('submits valid credentials and exposes block markers', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<Login onSubmit={onSubmit} />)
    const root = document.querySelector('[data-ai-role="login"]')
    expect(root).toHaveAttribute('data-ai-intent', 'authenticate')
    expect(root).toHaveClass('cu-block-login')

    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret-word')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'secret-word',
      remember: false,
    })
  })

  it('announces missing fields without calling onSubmit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Login onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Email and password are required.')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('formats ICU copy from authored locales', () => {
    expect(formatMessage('en', requireMessage(createCatalog(en), 'login.sessionCount'), { count: 0 })).toBe(
      'No saved sessions',
    )
    expect(createCatalog(zhCN).get('login.submit')).toBe('登录')
    expect(createCatalog(loginLocaleTrees.de).get('login.title')).toBe('Sign in')
  })

  it('inherits RTL from language without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Login locale="ar" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.querySelector('[data-ai-role="login"]')).not.toHaveAttribute('dir', 'ltr')
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })
})
