<script lang="ts">
export interface SheetProps {
  triggerLabel: string
  title: string
  closeLabel: string
  position?: 'start' | 'end' | 'bottom'
  open?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { DialogPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<SheetProps>(), { position: 'bottom' })
const emit = defineEmits<{ openChange: [open: boolean] }>()
const classes = computed(() => ['cu-sheet', 'cu-sheet--' + props.position, props.class].filter(Boolean).join(' '))

function onOpenChange(details: { open: boolean }) {
  emit('openChange', details.open)
}
</script>

<template>
  <DialogPrimitive.Root :open="open" @open-change="onOpenChange">
    <DialogPrimitive.Trigger class="cu-sheet__trigger">{{ triggerLabel }}</DialogPrimitive.Trigger>
    <Teleport to="body">
      <DialogPrimitive.Backdrop class="cu-sheet__backdrop" />
      <DialogPrimitive.Positioner>
        <DialogPrimitive.Content :class="classes" data-ai-role="sheet" data-ai-intent="present-overlay" :data-ai-state="open ? 'open' : 'closed'">
          <DialogPrimitive.Title class="cu-sheet__title">{{ title }}</DialogPrimitive.Title>
          <div class="cu-sheet__body"><slot /></div>
          <DialogPrimitive.CloseTrigger class="cu-sheet__close">{{ closeLabel }}</DialogPrimitive.CloseTrigger>
        </DialogPrimitive.Content>
      </DialogPrimitive.Positioner>
    </Teleport>
  </DialogPrimitive.Root>
</template>

<style src="./styles.css"></style>
