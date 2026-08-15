import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Passive scroll listener, coalesced to animation frames.
 * The callback must bail out when the derived window has not changed.
 *
 * @complexity time O(1) per frame | space O(1)
 * @guarantees at most one callback per frame; scroll handler is { passive: true }
 */
export function useRafScroll(onFrame: (node: HTMLElement) => void): Ref<HTMLDivElement | null> {
  const viewportRef = ref<HTMLDivElement | null>(null)
  let raf = 0
  let node: HTMLElement | null = null

  const tick = () => {
    raf = 0
    const current = viewportRef.value
    if (current) onFrame(current)
  }

  const onScroll = () => {
    if (raf) return
    raf = requestAnimationFrame(tick)
  }

  onMounted(() => {
    node = viewportRef.value
    if (!node) return
    node.addEventListener('scroll', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    node?.removeEventListener('scroll', onScroll)
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  })

  return viewportRef
}
