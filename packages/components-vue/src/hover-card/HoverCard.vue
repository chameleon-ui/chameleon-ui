<script lang="ts">
export interface HoverCardProps {
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { PopoverPrimitive } from '@chameleon-ui/primitives-vue'

const props = defineProps<HoverCardProps>()
const open = ref(false)
const classes = computed(() => ['cu-hover-card', props.class].filter(Boolean).join(' '))
</script>

<template>
  <PopoverPrimitive.Root :open="open" @open-change="(details: { open: boolean }) => (open = details.open)">
    <PopoverPrimitive.Trigger
      as-child
      class="cu-hover-card__trigger"
      @mouseenter="open = true"
      @mouseleave="open = false"
      @focus="open = true"
      @blur="open = false"
    >
      <slot name="trigger" />
    </PopoverPrimitive.Trigger>
    <PopoverPrimitive.Positioner>
      <PopoverPrimitive.Content
        :class="classes"
        data-ai-role="hover-card"
        data-ai-intent="preview-detail"
        :data-ai-state="open ? 'open' : 'closed'"
        @mouseenter="open = true"
        @mouseleave="open = false"
      >
        <slot />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
