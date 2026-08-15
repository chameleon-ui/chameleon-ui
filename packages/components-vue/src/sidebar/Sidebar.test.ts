import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Sidebar from './Sidebar.vue'

describe('Sidebar', () => {
  it('renders data-ai-role sidebar', () => {
    const wrapper = mount(Sidebar, {
      props: {
      label: "Nav",
      items: [{"value":"home","label":"Home"}],
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('sidebar')
  })
})
