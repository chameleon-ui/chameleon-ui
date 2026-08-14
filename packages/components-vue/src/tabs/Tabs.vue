<script lang="ts">
export interface TabItem {
  value: string
  label: string
  content: string
}

export interface TabsProps {
  items: TabItem[]
  defaultValue?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { TabsPrimitive } from '@chameleon-ui/primitives-vue'

const props = defineProps<TabsProps>()

const model = defineModel<string>('modelValue')

const classes = computed(() => ['cu-tabs', props.class].filter(Boolean).join(' '))
const dataAiState = computed(
  () => model.value ?? props.defaultValue ?? props.items[0]?.value ?? 'default',
)

function onValueChange(details: { value: string }) {
  model.value = details.value
}
</script>

<template>
  <TabsPrimitive.Root
    :class="classes"
    data-ai-role="tabs"
    data-ai-intent="switch-view"
    :data-ai-state="dataAiState"
    :default-value="defaultValue"
    :model-value="model"
    @value-change="onValueChange"
  >
    <TabsPrimitive.List class="cu-tabs__list">
      <TabsPrimitive.Trigger
        v-for="item in items"
        :key="item.value"
        class="cu-tabs__trigger"
        :value="item.value"
      >
        {{ item.label }}
      </TabsPrimitive.Trigger>
    </TabsPrimitive.List>
    <TabsPrimitive.Content
      v-for="item in items"
      :key="item.value"
      class="cu-tabs__content"
      :value="item.value"
    >
      {{ item.content }}
    </TabsPrimitive.Content>
  </TabsPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
