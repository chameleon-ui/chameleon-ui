import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CommandPalette from './CommandPalette.vue'

describe('CommandPalette', () => {
  it('renders closed state and filters when open', () => {
    const wrapper = mount(CommandPalette, {
      props: {
        open: true,
        label: 'Commands',
        commands: [
          { value: 'save', label: 'Save' },
          { value: 'open', label: 'Open' },
        ],
      },
    })
    expect(wrapper.attributes('data-ai-role')).toBe('command-palette')
    expect(wrapper.findAll('[role="option"]').length).toBe(2)
  })
})
