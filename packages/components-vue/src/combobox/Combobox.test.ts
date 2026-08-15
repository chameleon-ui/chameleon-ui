import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Combobox from './Combobox.vue'

describe('Combobox', () => {
  it('renders data-ai-role combobox', () => {
    const wrapper = mount(Combobox, {
      props: {
      options: ["Red","Blue"],
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('combobox')
  })
})
