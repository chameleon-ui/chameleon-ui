import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ArticleCard from './ArticleCard.vue'

describe('ArticleCard', () => {
  it('renders cu-article-card and data-ai-role', () => {
    const wrapper = mount(ArticleCard, {
      props: {
      title: "Hello",
      },
    })
    expect(wrapper.classes()).toContain('cu-article-card')
    expect(wrapper.attributes('data-ai-role')).toBe('article-card')
  })
})
