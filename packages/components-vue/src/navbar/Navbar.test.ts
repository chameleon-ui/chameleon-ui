import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Navbar from './Navbar.vue'

describe('Navbar', () => {
  it('renders data-ai-role navbar', () => {
    const wrapper = mount(Navbar, {
      props: {
      label: "Main",
      items: [{"value":"home","label":"Home"}],
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('navbar')
  })
})
