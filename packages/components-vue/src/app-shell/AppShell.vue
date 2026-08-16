<script lang="ts">
export type AppShellFooterPlacement = 'shell' | 'main' | 'auto'

export interface AppShellProps {
  sidebarLabel?: string
  /**
   * Where footer lives relative to the main scrollport.
   * - `auto` (default): compact → end of main scroll; ≥48rem → shell-bottom chrome
   * - `shell`: always a dedicated grid row outside main scroll
   * - `main`: always flows at the end of main content
   */
  footerPlacement?: AppShellFooterPlacement
  class?: string
}
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<AppShellProps>(), {
  sidebarLabel: 'Sidebar',
  footerPlacement: 'auto',
})

const slots = useSlots()
const classes = computed(() => ['cu-app-shell', props.class].filter(Boolean).join(' '))
const showFlow = computed(
  () => Boolean(slots.footer) && (props.footerPlacement === 'main' || props.footerPlacement === 'auto'),
)
const showChrome = computed(
  () => Boolean(slots.footer) && (props.footerPlacement === 'shell' || props.footerPlacement === 'auto'),
)
</script>

<template>
  <div
    :class="classes"
    data-cu-shell
    :data-footer-placement="slots.footer ? footerPlacement : undefined"
    data-ai-role="app-shell"
    data-ai-intent="layout-shell"
    data-ai-state="default"
  >
    <div class="cu-app-shell__frame">
      <header class="cu-app-shell__header">
        <slot name="header" />
      </header>
      <div v-if="slots.navigation" class="cu-app-shell__nav">
        <slot name="navigation" />
      </div>
      <aside v-if="slots.sidebar" :aria-label="sidebarLabel" class="cu-app-shell__sidebar">
        <slot name="sidebar" />
      </aside>
      <main class="cu-app-shell__main">
        <slot />
        <div
          v-if="showFlow"
          class="cu-app-shell__footer cu-app-shell__footer--flow"
          data-footer-host="main"
        >
          <slot name="footer" />
        </div>
      </main>
      <footer
        v-if="showChrome"
        class="cu-app-shell__footer cu-app-shell__footer--chrome"
        data-footer-host="shell"
      >
        <slot name="footer" />
      </footer>
      <div v-if="slots.tabBar" class="cu-app-shell__tab-bar">
        <slot name="tabBar" />
      </div>
    </div>
  </div>
</template>

<style src="./styles.css"></style>
