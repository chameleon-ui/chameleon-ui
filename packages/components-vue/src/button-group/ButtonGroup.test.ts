import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ButtonGroup from './ButtonGroup.vue'

describe('ButtonGroup', () => {
  it('renders an attached horizontal group', () => {
    const wrapper = mount(ButtonGroup, {
      props: { label: 'Mask tools', size: 'sm' },
      slots: {
        default: '<button class="cu-button">Paint</button><button class="cu-button">Erase</button>',
      },
    })

    expect(wrapper.classes()).toContain('cu-button-group')
    expect(wrapper.classes()).toContain('cu-button-group--horizontal')
    expect(wrapper.classes()).toContain('cu-button-group--attached')
    expect(wrapper.classes()).toContain('cu-button-group--sm')
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Mask tools')
    expect(wrapper.attributes('data-ai-role')).toBe('button-group')
    expect(wrapper.attributes('data-ai-intent')).toBe('select-single')
  })

  it('supports vertical spaced layout', () => {
    const wrapper = mount(ButtonGroup, {
      props: { orientation: 'vertical', variant: 'spaced' },
      slots: {
        default: '<button class="cu-button">One</button><button class="cu-button">Two</button>',
      },
    })

    expect(wrapper.classes()).toContain('cu-button-group--vertical')
    expect(wrapper.classes()).toContain('cu-button-group--spaced')
    expect(wrapper.attributes('data-orientation')).toBe('vertical')
    expect(wrapper.attributes('data-variant')).toBe('spaced')
  })
})
