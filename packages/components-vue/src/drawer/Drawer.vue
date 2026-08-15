<script lang="ts">
export interface DrawerProps {
  triggerLabel: string
  title: string
  closeLabel: string
  position?: 'start' | 'end'
  open?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { DialogPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<DrawerProps>(), { position: 'end' })
const emit = defineEmits<{ openChange: [open: boolean] }>()
const classes = computed(() => ['cu-drawer', 'cu-drawer--' + props.position, props.class].filter(Boolean).join(' '))

function onOpenChange(details: { open: boolean }) {
  emit('openChange', details.open)
}
</script>

<template>
  <DialogPrimitive.Root :open="open" @open-change="onOpenChange">
    <DialogPrimitive.Trigger class="cu-drawer__trigger">{{ triggerLabel }}</DialogPrimitive.Trigger>
    <Teleport to="body">
      <DialogPrimitive.Backdrop class="cu-drawer__backdrop" />
      <DialogPrimitive.Positioner>
        <DialogPrimitive.Content :class="classes" data-ai-role="drawer" data-ai-intent="reveal-detail" :data-ai-state="open ? 'open' : 'closed'">
          <DialogPrimitive.Title class="cu-drawer__title">{{ title }}</DialogPrimitive.Title>
          <div class="cu-drawer__body"><slot /></div>
          <DialogPrimitive.CloseTrigger class="cu-drawer__close">{{ closeLabel }}</DialogPrimitive.CloseTrigger>
        </DialogPrimitive.Content>
      </DialogPrimitive.Positioner>
    </Teleport>
  </DialogPrimitive.Root>
</template>

<style src="./styles.css"></style>
