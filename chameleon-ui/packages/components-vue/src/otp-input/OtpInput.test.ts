import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import OtpInput from './OtpInput.vue'

describe('OtpInput', () => {
  it('renders data-ai-role otp-input', () => {
    const wrapper = mount(OtpInput, {
      props: {
      value: "",
      label: "Code",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('otp-input')
  })
})
