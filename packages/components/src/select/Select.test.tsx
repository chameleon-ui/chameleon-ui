import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale } from '@chameleon-ui/i18n'
import { Select } from './Select.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
]

function ControlledSelect(props: { value: string; onChange?: (value: string) => void }) {
  const [value, setValue] = useState(props.value)
  return (
    <Select
      label="Number"
      onChange={(next) => {
        setValue(next)
        props.onChange?.(next)
      }}
      options={options}
      value={value}
    />
  )
}

describe('Select', () => {
  it('selects an option and updates the trigger text', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<ControlledSelect value="" onChange={onChange} />)
    const trigger = screen.getByRole('combobox', { name: 'Number' })
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('option', { name: 'Two' }))
    await waitFor(() => {
      expect(trigger).toHaveTextContent('Two')
    })
    expect(onChange).toHaveBeenCalledWith('two')
  })

  it('keeps Arabic copy and RTL direction together', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    const copy = createCatalog(ar)

    render(<Select label={copy.get('select.label') ?? ''} onChange={() => undefined} options={options} value="" />)
    expect(document.documentElement.dir).toBe('rtl')
    expect(screen.getByRole('combobox', { name: 'اختيار' })).toBeInTheDocument()
  })

  it('formats ICU copy from bundled locales', () => {
    expect(createCatalog(en).get('select.placeholder')).toBe('Select an option')
    expect(createCatalog(de).get('select.label')).toBe('Auswahl treffen')
    expect(createCatalog(zhCN).get('select.placeholder')).toBe('请选择')
  })
})
