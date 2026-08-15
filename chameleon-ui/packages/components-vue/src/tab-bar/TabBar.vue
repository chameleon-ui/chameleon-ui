<script lang="ts">
export interface TabBarItem {
  value: string
  label: string
}

export interface TabBarProps {
  label: string
  items: TabBarItem[]
  defaultValue?: string
  value?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { TabsPrimitive } from '@chameleon-ui/primitives-vue'

const props = defineProps<TabBarProps>()
const emit = defineEmits<{ change: [value: string] }>()
const classes = computed(() => ['cu-tab-bar', props.class].filter(Boolean).join(' '))
const active = computed(() => props.value ?? props.defaultValue ?? props.items[0]?.value ?? 'default')

function onValueChange(details: { value: string }) {
  emit('change', details.value)
}
</script>

<template>
  <TabsPrimitive.Root
    :class="classes"
    data-ai-role="tab-bar"
    data-ai-intent="navigate-sections"
    :data-ai-state="active"
    :default-value="defaultValue ?? items[0]?.value"
    :model-value="value"
    @value-change="onValueChange"
  >
    <TabsPrimitive.List class="cu-tab-bar__list" :aria-label="label">
      <TabsPrimitive.Trigger v-for="item in items" :key="item.value" class="cu-tab-bar__item" :value="item.value">
        <span class="cu-tab-bar__label">{{ item.label }}</span>
      </TabsPrimitive.Trigger>
    </TabsPrimitive.List>
  </TabsPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
