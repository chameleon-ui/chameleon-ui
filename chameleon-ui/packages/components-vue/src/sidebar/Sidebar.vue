<script lang="ts">
export interface SidebarItem {
  value: string
  label: string
}

export interface SidebarProps {
  label: string
  items: SidebarItem[]
  activeValue?: string
  collapsible?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
  expandLabel?: string
  collapseLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref, useId, useSlots } from 'vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: false,
  defaultCollapsed: false,
  expandLabel: 'Expand sidebar',
  collapseLabel: 'Collapse sidebar',
})
const emit = defineEmits<{ select: [value: string]; collapsedChange: [collapsed: boolean] }>()
const slots = useSlots()
const internalCollapsed = ref(props.defaultCollapsed)
const isCollapsed = computed(() => props.collapsed ?? internalCollapsed.value)
const navId = useId()
const classes = computed(() => ['cu-sidebar', isCollapsed.value && 'cu-sidebar--collapsed', props.class].filter(Boolean).join(' '))

function requestCollapsedChange(next: boolean) {
  if (props.collapsed === undefined) internalCollapsed.value = next
  emit('collapsedChange', next)
}
</script>

<template>
  <aside :class="classes" :aria-label="label" data-ai-role="sidebar" data-ai-intent="navigate-sections" :data-ai-state="isCollapsed ? 'collapsed' : 'expanded'">
    <div v-if="slots.header" class="cu-sidebar__header"><slot name="header" /></div>
    <nav :id="navId" class="cu-sidebar__nav" :aria-label="label">
      <ul class="cu-sidebar__list">
        <li v-for="item in items" :key="item.value" class="cu-sidebar__entry">
          <button
            type="button"
            class="cu-sidebar__item"
            :aria-current="activeValue === item.value ? 'page' : undefined"
            :aria-label="item.label"
            @click="emit('select', item.value)"
          >
            <span class="cu-sidebar__label">{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </nav>
    <button
      v-if="collapsible"
      type="button"
      class="cu-sidebar__toggle"
      :aria-expanded="!isCollapsed"
      :aria-controls="navId"
      :aria-label="isCollapsed ? expandLabel : collapseLabel"
      @click="requestCollapsedChange(!isCollapsed)"
    >
      <span aria-hidden="true" class="cu-sidebar__toggle-icon" :data-direction="isCollapsed ? 'expand' : 'collapse'">
        <svg viewBox="0 0 24 24" class="cu-sidebar__toggle-svg">
          <path :d="isCollapsed ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </span>
      <span class="cu-sidebar__label">{{ isCollapsed ? expandLabel : collapseLabel }}</span>
    </button>
  </aside>
</template>

<style src="./styles.css"></style>
