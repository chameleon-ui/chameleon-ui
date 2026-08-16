import { createRef, act } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { createCatalog, requireMessage } from '@chameleon-ui/i18n'
import { MaskPaintCanvas, type MaskPaintCanvasHandle } from './MaskPaintCanvas.js'
import en from './locales/en.json'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('MaskPaintCanvas', () => {
  it('renders the paint stage host', () => {
    const { container } = render(<MaskPaintCanvas src="/sample.png" checkerboard={false} />)
    expect(container.querySelector('.cu-mask-paint-canvas')).toHaveAttribute(
      'data-ai-role',
      'mask-paint-canvas',
    )
    expect(container.querySelector('.cu-mask-paint-canvas__stage')).not.toBeNull()
  })

  it('defaults checkerboard to strong contrast on the fitted checker', () => {
    const { container } = render(<MaskPaintCanvas src="/sample.png" />)
    const surface = container.querySelector('.cu-mask-paint-canvas__checker.cu-checkerboard-surface')
    expect(surface).toHaveAttribute('data-contrast', 'strong')
    expect(container.querySelector('.cu-mask-paint-canvas__stage')).not.toBeNull()
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'mask-paint-canvas.label')).toBeDefined()
  })

  it('exposes a zoom handle with clamping and onZoomChange', () => {
    const ref = createRef<MaskPaintCanvasHandle>()
    const onZoomChange = vi.fn()
    const { container } = render(
      <MaskPaintCanvas
        ref={ref}
        src="/sample.png"
        checkerboard={false}
        onZoomChange={onZoomChange}
      />,
    )
    expect(ref.current!.getZoom()).toBe(1)
    expect(container.querySelector('.cu-mask-paint-canvas')).toHaveAttribute('data-zoom', '1')
    act(() => ref.current!.zoomIn())
    expect(ref.current!.getZoom()).toBe(1.25)
    expect(onZoomChange).toHaveBeenLastCalledWith(1.25)
    expect(container.querySelector('.cu-mask-paint-canvas')).toHaveAttribute('data-zoom', '1.25')
    act(() => ref.current!.setZoom(100))
    expect(ref.current!.getZoom()).toBe(8)
    expect(onZoomChange).toHaveBeenLastCalledWith(8)
    act(() => ref.current!.setZoom(0))
    expect(ref.current!.getZoom()).toBe(1)
    act(() => ref.current!.zoomOut())
    expect(ref.current!.getZoom()).toBe(1)
    act(() => ref.current!.zoomIn(2))
    expect(ref.current!.getZoom()).toBe(2)
    act(() => ref.current!.resetZoom())
    expect(ref.current!.getZoom()).toBe(1)
  })

  it('respects minZoom / maxZoom props', () => {
    const ref = createRef<MaskPaintCanvasHandle>()
    render(<MaskPaintCanvas ref={ref} src="/sample.png" checkerboard={false} minZoom={0.5} maxZoom={4} />)
    act(() => ref.current!.setZoom(100))
    expect(ref.current!.getZoom()).toBe(4)
    act(() => ref.current!.setZoom(0.1))
    expect(ref.current!.getZoom()).toBe(0.5)
  })

  it('controlled zoom waits for the prop and only emits onZoomChange', () => {
    const ref = createRef<MaskPaintCanvasHandle>()
    const onZoomChange = vi.fn()
    const { container, rerender } = render(
      <MaskPaintCanvas
        ref={ref}
        src="/sample.png"
        checkerboard={false}
        zoom={3}
        onZoomChange={onZoomChange}
      />,
    )
    expect(ref.current!.getZoom()).toBe(3)
    act(() => ref.current!.setZoom(2))
    expect(onZoomChange).toHaveBeenLastCalledWith(2)
    expect(ref.current!.getZoom()).toBe(3)
    expect(container.querySelector('.cu-mask-paint-canvas')).toHaveAttribute('data-zoom', '3')
    rerender(
      <MaskPaintCanvas
        ref={ref}
        src="/sample.png"
        checkerboard={false}
        zoom={2}
        onZoomChange={onZoomChange}
      />,
    )
    expect(ref.current!.getZoom()).toBe(2)
    expect(container.querySelector('.cu-mask-paint-canvas')).toHaveAttribute('data-zoom', '2')
  })
})
