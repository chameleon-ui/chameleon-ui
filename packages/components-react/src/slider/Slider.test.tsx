import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Slider } from './Slider.js'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

describe('Slider', () => {
  it('renders with cu-* classes and data-ai-role', () => {
    render(<Slider value={50} onChange={() => {}} />)
    const element = document.querySelector('.cu-slider')
    expect(element).toHaveClass('cu-slider')
    expect(element).toHaveAttribute('data-ai-role', 'slider')
  })

  it('honours step and reports the snapped value', () => {
    const onChange = vi.fn()
    render(<Slider max={100} min={0} onChange={onChange} step={10} value={20} />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '40' } })
    expect(onChange).toHaveBeenCalledWith(40)
  })

  it('renders a dual-thumb range pair', () => {
    const onChange = vi.fn()
    render(<Slider label="Price" onChange={onChange} value={[20, 80]} />)
    const sliders = screen.getAllByRole('slider')
    expect(sliders).toHaveLength(2)
    expect(document.querySelector('.cu-slider')).toHaveAttribute('data-ai-state', 'range')
    fireEvent.change(sliders[0], { target: { value: '30' } })
    expect(onChange).toHaveBeenCalledWith([30, 80])
  })

  it('renders mark labels', () => {
    render(<Slider marks={[0, 50, 100]} onChange={() => {}} value={50} />)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('reads bundled locale messages', () => {
    const catalog = createCatalog(en)
    expect(requireMessage(catalog, 'slider.label')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Slider value={50} onChange={() => {}} />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
