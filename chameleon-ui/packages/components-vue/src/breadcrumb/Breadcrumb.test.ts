import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Breadcrumb from './Breadcrumb.vue'

describe('Breadcrumb', () => {
  it('renders cu-breadcrumb and data-ai-role', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
      items: [{"label":"Home","href":"/"},{"label":"Here"}],
      },
    })
    expect(wrapper.classes()).toContain('cu-breadcrumb')
    expect(wrapper.attributes('data-ai-role')).toBe('breadcrumb')
  })
})
