import { useState } from 'react'

export interface StackScreen {
  id: string
  title: string
}

/**
 * Per-tab navigation stacks (UITabBarController + one UINavigationController
 * per tab). Switching tabs does not push; it shows that tab's stack. Push/pop
 * only move the active tab's stack.
 */
export function useTabStacks(tabs: Array<{ value: string; title: string }>, initialTab?: string) {
  const [tab, setTab] = useState(initialTab ?? tabs[0]?.value ?? '')
  const [pushed, setPushed] = useState<Record<string, StackScreen[]>>({})
  const tabMeta = tabs.find((item) => item.value === tab) ?? tabs[0]
  const extra = tabMeta ? (pushed[tabMeta.value] ?? []) : []
  const root: StackScreen = { id: tabMeta?.value ?? '', title: tabMeta?.title ?? '' }
  const stack = [root, ...extra]
  const current = stack[stack.length - 1] ?? root
  const previous = stack.length > 1 ? stack[stack.length - 2] : undefined

  return {
    tab: tabMeta?.value ?? '',
    selectTab: setTab,
    current,
    previous,
    canPop: extra.length > 0,
    push(screen: StackScreen) {
      if (!tabMeta) return
      setPushed((state) => ({
        ...state,
        [tabMeta.value]: [...(state[tabMeta.value] ?? []), screen],
      }))
    },
    pop() {
      if (!tabMeta) return
      setPushed((state) => ({
        ...state,
        [tabMeta.value]: (state[tabMeta.value] ?? []).slice(0, -1),
      }))
    },
  }
}
