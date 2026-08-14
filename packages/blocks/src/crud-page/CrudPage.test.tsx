import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { CrudPage } from './CrudPage.js'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('CrudPage', () => {
  it('lists seed rows and inserts a record from the dialog', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    render(<CrudPage onCreate={onCreate} pageSize={10} />)

    expect(document.querySelector('[data-ai-role="crud-page"]')).toHaveAttribute(
      'data-ai-intent',
      'manage-records',
    )
    expect(screen.getByRole('grid', { name: 'Records' })).toBeInTheDocument()
    expect(screen.getByText('Northwind')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'New record' }))
    const dialog = await screen.findByRole('dialog', { name: 'Create record' })
    expect(dialog).toBeInTheDocument()

    await user.type(screen.getByLabelText('Name'), 'Adventure Works')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.getByText('Adventure Works')).toBeInTheDocument()
    })
    expect(onCreate).toHaveBeenCalledTimes(1)
    expect(onCreate.mock.calls[0]?.[0]).toMatchObject({ name: 'Adventure Works' })
  })

  it('renders the empty state when no rows are provided', () => {
    render(<CrudPage rows={[]} />)
    expect(screen.getByText('No records yet')).toBeInTheDocument()
    expect(document.querySelector('[data-ai-role="crud-page"]')).toHaveAttribute('data-ai-state', 'empty')
  })

  it('keeps Chinese copy without forcing ltr on the block', () => {
    document.documentElement.lang = 'zh-CN'
    document.documentElement.dir = directionForLocale('zh-CN')
    render(<CrudPage locale="zh-CN" />)
    expect(createCatalog(zhCN).get('crud.create')).toBe('新建记录')
    expect(screen.getByRole('button', { name: '新建记录' })).toBeInTheDocument()
    expect(document.querySelector('[data-ai-role="crud-page"]')).not.toHaveAttribute('dir', 'ltr')
    expect(createCatalog(en).get('crud.submit')).toBe('Save')
  })
})
