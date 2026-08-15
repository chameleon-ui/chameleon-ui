import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PasswordInput from './PasswordInput.vue'

describe('PasswordInput', () => {
  it('renders data-ai-role password-input', () => {
    const wrapper = mount(PasswordInput, {
      props: {
      value: "",
      label: "Password",
      showLabel: "Show",
      hideLabel: "Hide",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('password-input')
  })
})
