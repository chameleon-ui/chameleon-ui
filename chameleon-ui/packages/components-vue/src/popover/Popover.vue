<script lang="ts">
export interface PopoverProps {
  title: string
  description: string
  closeLabel: string
  defaultOpen?: boolean
}
</script>

<script setup lang="ts">
import { PopoverPrimitive } from '@chameleon-ui/primitives-vue'

withDefaults(defineProps<PopoverProps>(), {
  defaultOpen: false,
})

const open = defineModel<boolean>('open')

function onOpenChange(details: { open: boolean }) {
  open.value = details.open
}
</script>

<template>
  <PopoverPrimitive.Root :default-open="defaultOpen" :open="open" @open-change="onOpenChange">
    <PopoverPrimitive.Trigger as-child class="cu-popover__trigger">
      <slot name="trigger" />
    </PopoverPrimitive.Trigger>
    <PopoverPrimitive.Positioner class="cu-popover__positioner">
      <PopoverPrimitive.Content
        class="cu-popover__content"
        data-ai-role="popover"
        data-ai-intent="reveal-context"
        data-ai-state="open"
      >
        <PopoverPrimitive.Title class="cu-popover__title">{{ title }}</PopoverPrimitive.Title>
        <PopoverPrimitive.Description class="cu-popover__description">
          {{ description }}
        </PopoverPrimitive.Description>
        <div v-if="$slots.default" class="cu-popover__body">
          <slot />
        </div>
        <PopoverPrimitive.CloseTrigger class="cu-popover__close">
          {{ closeLabel }}
        </PopoverPrimitive.CloseTrigger>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
