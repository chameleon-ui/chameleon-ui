import { useEffect, useRef, type RefObject } from 'react'

/**
 * Passive scroll listener, coalesced to animation frames.
 * The callback must bail out when the derived window has not changed.
 *
 * @complexity time O(1) per frame | space O(1)
 * @guarantees at most one callback per frame; scroll handler is { passive: true }
 */
export function useRafScroll(onFrame: (node: HTMLElement) => void): RefObject<HTMLDivElement | null> {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const onFrameRef = useRef(onFrame)
  onFrameRef.current = onFrame
  const rafRef = useRef(0)

  useEffect(() => {
    const node = viewportRef.current
    if (!node) return
    const tick = () => {
      rafRef.current = 0
      const current = viewportRef.current
      if (current) onFrameRef.current(current)
    }
    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(tick)
    }
    node.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      node.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
  }, [])

  return viewportRef
}
