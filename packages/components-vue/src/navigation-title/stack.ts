import { computed, reactive } from 'vue'

export interface StackScreen {
  id: string
  title: string
}

export interface TabStacks {
  tab: string
  selectTab: (value: string) => void
  current: StackScreen
  previous: StackScreen | undefined
  canPop: boolean
  push: (screen: StackScreen) => void
  pop: () => void
}

/**
 * Per-tab navigation stacks. Switching tabs does not push; it shows that
 * tab's stack. Push/pop only move the active tab's stack.
 */
export function useTabStacks(tabs: Array<{ value: string; title: string }>, initialTab?: string): TabStacks {
  const state = reactive({
    tab: initialTab ?? tabs[0]?.value ?? '',
    pushed: {} as Record<string, StackScreen[]>,
  })

  const tabMeta = computed(() => tabs.find((item) => item.value === state.tab) ?? tabs[0])
  const extra = computed(() => (tabMeta.value ? (state.pushed[tabMeta.value.value] ?? []) : []))
  const root = computed<StackScreen>(() => ({
    id: tabMeta.value?.value ?? '',
    title: tabMeta.value?.title ?? '',
  }))
  const stack = computed(() => [root.value, ...extra.value])
  const currentScreen = computed(() => stack.value[stack.value.length - 1] ?? root.value)
  const previousScreen = computed(() => (stack.value.length > 1 ? stack.value[stack.value.length - 2] : undefined))
  const hasStack = computed(() => extra.value.length > 0)

  return reactive({
    get tab() {
      return state.tab
    },
    selectTab(value: string) {
      state.tab = value
    },
    get current() {
      return currentScreen.value
    },
    get previous() {
      return previousScreen.value
    },
    get canPop() {
      return hasStack.value
    },
    push(screen: StackScreen) {
      if (!tabMeta.value) return
      const key = tabMeta.value.value
      state.pushed[key] = [...(state.pushed[key] ?? []), screen]
    },
    pop() {
      if (!tabMeta.value) return
      const key = tabMeta.value.value
      state.pushed[key] = (state.pushed[key] ?? []).slice(0, -1)
    },
  }) as TabStacks
}
