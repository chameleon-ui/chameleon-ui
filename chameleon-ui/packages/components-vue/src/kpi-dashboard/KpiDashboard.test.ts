import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import KpiDashboard from './KpiDashboard.vue'

describe('KpiDashboard', () => {
  it('renders data-ai-role kpi-dashboard', () => {
    const wrapper = mount(KpiDashboard, {
      props: {
      items: [{"id":"1","label":"Users","value":"12"}],
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('kpi-dashboard')
  })
})
