import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Ticker from './Ticker.vue'

describe('Ticker', () => {
  it('renders cu-ticker and data-ai-role', () => {
    const wrapper = mount(Ticker, {
      props: {
      items: [{"id":"aapl","label":"AAPL","value":"190"}],
      },
    })
    expect(wrapper.classes()).toContain('cu-ticker')
    expect(wrapper.attributes('data-ai-role')).toBe('ticker')
  })
})
