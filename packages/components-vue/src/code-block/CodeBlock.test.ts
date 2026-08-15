import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CodeBlock from './CodeBlock.vue'

describe('CodeBlock', () => {
  it('renders data-ai-role code-block', () => {
    const wrapper = mount(CodeBlock, {
      props: {
      code: "const x = 1",
      },
    })
    expect(wrapper.attributes('data-ai-role') ?? wrapper.find('[data-ai-role]').attributes('data-ai-role')).toBe('code-block')
  })
})
