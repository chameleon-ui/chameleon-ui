import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MaskPaintCanvas from './MaskPaintCanvas.vue'
import type { MaskPaintCanvasHandle } from './MaskPaintCanvas.vue'

function handleOf(wrapper: ReturnType<typeof mount>) {
  return wrapper.vm as unknown as MaskPaintCanvasHandle
}

describe('MaskPaintCanvas', () => {
  it('renders the paint stage with default zoom 1', () => {
    const wrapper = mount(MaskPaintCanvas, {
      props: { src: '/sample.png', checkerboard: false },
    })
    expect(wrapper.attributes('data-ai-role')).toBe('mask-paint-canvas')
    expect(wrapper.attributes('data-zoom')).toBe('1')
    expect(wrapper.find('.cu-mask-paint-canvas__stage').exists()).toBe(true)
  })

  it('exposes a zoom handle with clamping and zoomChange emit', async () => {
    const wrapper = mount(MaskPaintCanvas, {
      props: { src: '/sample.png', checkerboard: false },
    })
    const handle = handleOf(wrapper)
    expect(handle.getZoom()).toBe(1)
    handle.zoomIn()
    expect(handle.getZoom()).toBe(1.25)
    expect(wrapper.emitted('zoomChange')?.at(-1)).toEqual([1.25])
    await wrapper.vm.$nextTick()
    expect(wrapper.attributes('data-zoom')).toBe('1.25')
    handle.setZoom(100)
    expect(handle.getZoom()).toBe(8)
    expect(wrapper.emitted('zoomChange')?.at(-1)).toEqual([8])
    handle.setZoom(0)
    expect(handle.getZoom()).toBe(1)
    handle.zoomIn(2)
    expect(handle.getZoom()).toBe(2)
    handle.resetZoom()
    expect(handle.getZoom()).toBe(1)
  })

  it('respects minZoom / maxZoom props', () => {
    const wrapper = mount(MaskPaintCanvas, {
      props: { src: '/sample.png', checkerboard: false, minZoom: 0.5, maxZoom: 4 },
    })
    const handle = handleOf(wrapper)
    handle.setZoom(100)
    expect(handle.getZoom()).toBe(4)
    handle.setZoom(0.1)
    expect(handle.getZoom()).toBe(0.5)
  })

  it('controlled zoom waits for the prop and only emits zoomChange', async () => {
    const wrapper = mount(MaskPaintCanvas, {
      props: { src: '/sample.png', checkerboard: false, zoom: 3 },
    })
    const handle = handleOf(wrapper)
    expect(handle.getZoom()).toBe(3)
    handle.setZoom(2)
    expect(wrapper.emitted('zoomChange')?.at(-1)).toEqual([2])
    expect(handle.getZoom()).toBe(3)
    expect(wrapper.attributes('data-zoom')).toBe('3')
    await wrapper.setProps({ zoom: 2 })
    expect(handle.getZoom()).toBe(2)
    expect(wrapper.attributes('data-zoom')).toBe('2')
  })
})
