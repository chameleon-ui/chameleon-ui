<script lang="ts">
export interface TooltipProps {
  content: string
  openDelay?: number
  closeDelay?: number
  defaultOpen?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { TooltipPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<TooltipProps>(), {
  openDelay: 300,
  closeDelay: 100,
  defaultOpen: false,
})

const classes = computed(() => ['cu-tooltip', props.class].filter(Boolean).join(' '))
</script>

<template>
  <TooltipPrimitive.Root :close-delay="closeDelay" :default-open="defaultOpen" :open-delay="openDelay">
    <TooltipPrimitive.Trigger as-child class="cu-tooltip__trigger">
      <slot name="trigger" />
    </TooltipPrimitive.Trigger>
    <TooltipPrimitive.Positioner class="cu-tooltip__positioner">
      <TooltipPrimitive.Content
        :class="classes"
        data-ai-role="tooltip"
        data-ai-intent="explain-on-hover"
        data-ai-state="open"
        role="tooltip"
      >
        {{ content }}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
