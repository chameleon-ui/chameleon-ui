<script lang="ts">
export interface AppShellProps {
  sidebarLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<AppShellProps>(), {
  sidebarLabel: 'Sidebar',
})

const slots = useSlots()
const classes = computed(() => ['cu-app-shell', props.class].filter(Boolean).join(' '))
</script>

<template>
  <div :class="classes" data-ai-role="app-shell" data-ai-intent="layout-shell" data-ai-state="default">
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
      </main>
      <div v-if="slots.tabBar" class="cu-app-shell__tab-bar">
        <slot name="tabBar" />
      </div>
    </div>
  </div>
</template>

<style src="./styles.css"></style>
