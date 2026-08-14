import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, formatMessage, requireMessage } from '@chameleon-ui/i18n'
import { Register } from './Register.js'
import { registerLocaleTrees } from './locale-map.js'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Register', () => {
  it('submits valid details and exposes block markers', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<Register onSubmit={onSubmit} />)
    const root = document.querySelector('[data-ai-role="register"]')
    expect(root).toHaveAttribute('data-ai-intent', 'create-account')
    expect(root).toHaveClass('cu-block-register')

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret-word')
    await user.type(screen.getByLabelText('Confirm password'), 'secret-word')
    await user.click(screen.getByRole('checkbox', { name: 'I agree to the terms' }))
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secret-word',
      terms: true,
    })
  })

  it('announces missing fields without calling onSubmit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Register onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Name, email, and password are required.')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects mismatched passwords', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Register onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret-word')
    await user.type(screen.getByLabelText('Confirm password'), 'other-word')
    await user.click(screen.getByRole('checkbox', { name: 'I agree to the terms' }))
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match.')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('formats ICU copy from authored locales', () => {
    expect(formatMessage('en', requireMessage(createCatalog(en), 'register.accountCount'), { count: 0 })).toBe(
      'No accounts created',
    )
    expect(createCatalog(zhCN).get('register.submit')).toBe('创建账户')
    expect(createCatalog(registerLocaleTrees.de).get('register.title')).toBe('Create an account')
  })

  it('inherits RTL from language without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Register locale="ar" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.querySelector('[data-ai-role="register"]')).not.toHaveAttribute('dir', 'ltr')
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument()
  })
})
