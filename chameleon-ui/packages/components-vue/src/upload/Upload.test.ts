import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Upload from './Upload.vue'

function file(name: string, size = 2048): File {
  return new File(['x'.repeat(size)], name, { type: 'text/plain' })
}

describe('Upload', () => {
  it('renders the dropzone with cu-* classes and data-ai attributes', () => {
    const wrapper = mount(Upload, { props: { label: 'Attachments' } })
    expect(wrapper.classes()).toContain('cu-upload')
    expect(wrapper.attributes('data-ai-role')).toBe('upload')
    expect(wrapper.attributes('data-ai-state')).toBe('default')
  })

  it('accepts dropped files and reports them', async () => {
    const wrapper = mount(Upload, { props: { label: 'Attachments' } })
    const zone = wrapper.get('[role="button"]')
    await zone.trigger('drop', { dataTransfer: { files: [file('a.txt'), file('b.txt')] } })
    expect(wrapper.emitted('files')?.[0]?.[0].map((entry: File) => entry.name)).toEqual(['a.txt', 'b.txt'])
    expect(wrapper.text()).toContain('a.txt')
    expect(wrapper.attributes('data-ai-state')).toBe('uploading')
  })

  it('rejects files that miss accept or exceed maxSize', async () => {
    const wrapper = mount(Upload, {
      props: { accept: '.txt,text/plain', label: 'Attachments', maxSize: 100 },
    })
    await wrapper.get('[role="button"]').trigger('drop', {
      dataTransfer: {
        files: [file('ok.txt', 40), file('big.txt', 400), new File(['x'], 'photo.png', { type: 'image/png' })],
      },
    })
    const accepted = wrapper.emitted('files')?.[0]?.[0] as File[] | undefined
    const rejected = wrapper.emitted('reject')?.[0]?.[0] as Array<{ file: File; reason: string }> | undefined
    expect(accepted?.map((entry) => entry.name)).toEqual(['ok.txt'])
    expect(rejected?.map((item) => ({ name: item.file.name, reason: item.reason }))).toEqual([
      { name: 'big.txt', reason: 'size' },
      { name: 'photo.png', reason: 'type' },
    ])
  })
})
