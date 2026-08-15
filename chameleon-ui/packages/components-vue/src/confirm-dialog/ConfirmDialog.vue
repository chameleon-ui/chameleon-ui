<script lang="ts">
export interface ConfirmDialogProps {
  triggerLabel: string
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  class?: string
}
</script>

<script setup lang="ts">
import { DialogPrimitive } from '@chameleon-ui/primitives-vue'

defineProps<ConfirmDialogProps>()
const emit = defineEmits<{ confirm: [] }>()
const contentDir = typeof document === 'undefined' ? undefined : document.documentElement.dir || undefined
</script>

<template>
  <DialogPrimitive.Root lazy-mount restore-focus unmount-on-exit>
    <DialogPrimitive.Trigger class="cu-button cu-button--solid cu-button--md cu-confirm-dialog__trigger">{{ triggerLabel }}</DialogPrimitive.Trigger>
    <Teleport to="body">
      <DialogPrimitive.Backdrop class="cu-dialog__backdrop" />
      <DialogPrimitive.Positioner class="cu-dialog__positioner">
        <DialogPrimitive.Content
          :class="['cu-dialog__content', 'cu-confirm-dialog__content', $props.class].filter(Boolean).join(' ')"
          data-ai-role="confirm-dialog"
          data-ai-intent="confirm-decision"
          data-ai-state="open"
          :dir="contentDir"
        >
          <DialogPrimitive.Title class="cu-dialog__title">{{ title }}</DialogPrimitive.Title>
          <DialogPrimitive.Description class="cu-dialog__description">{{ description }}</DialogPrimitive.Description>
          <div class="cu-dialog__actions cu-confirm-dialog__actions">
            <DialogPrimitive.CloseTrigger class="cu-button cu-button--outline cu-button--md">{{ cancelLabel }}</DialogPrimitive.CloseTrigger>
            <DialogPrimitive.CloseTrigger class="cu-button cu-button--solid cu-button--md" @click="emit('confirm')">{{ confirmLabel }}</DialogPrimitive.CloseTrigger>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Positioner>
    </Teleport>
  </DialogPrimitive.Root>
</template>

<style src="../button/styles.css"></style>
<style src="../dialog/styles.css"></style>
<style src="./styles.css"></style>
