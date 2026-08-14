<script lang="ts">
export interface DialogProps {
  triggerLabel: string
  title: string
  description: string
  closeLabel: string
  defaultOpen?: boolean
}
</script>

<script setup lang="ts">
import { DialogPrimitive } from '@chameleon-ui/primitives-vue'

withDefaults(defineProps<DialogProps>(), {
  defaultOpen: false,
})

const open = defineModel<boolean>('open')

function onOpenChange(details: { open: boolean }) {
  open.value = details.open
}

const contentDir = typeof document === 'undefined' ? undefined : document.documentElement.dir || undefined
</script>

<template>
  <DialogPrimitive.Root
    :default-open="defaultOpen"
    lazy-mount
    :open="open"
    restore-focus
    unmount-on-exit
    @open-change="onOpenChange"
  >
    <DialogPrimitive.Trigger class="cu-button cu-button--solid cu-button--md cu-dialog__trigger">
      {{ triggerLabel }}
    </DialogPrimitive.Trigger>
    <Teleport to="body">
      <DialogPrimitive.Backdrop class="cu-dialog__backdrop" />
      <DialogPrimitive.Positioner class="cu-dialog__positioner">
        <DialogPrimitive.Content
          class="cu-dialog__content"
          data-ai-role="dialog"
          data-ai-intent="confirm-decision"
          data-ai-state="open"
          :dir="contentDir"
        >
          <DialogPrimitive.Title class="cu-dialog__title">{{ title }}</DialogPrimitive.Title>
          <DialogPrimitive.Description class="cu-dialog__description">
            {{ description }}
          </DialogPrimitive.Description>
          <div v-if="$slots.default" class="cu-dialog__body">
            <slot />
          </div>
          <div class="cu-dialog__actions">
            <DialogPrimitive.CloseTrigger class="cu-button cu-button--outline cu-button--md">
              {{ closeLabel }}
            </DialogPrimitive.CloseTrigger>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Positioner>
    </Teleport>
  </DialogPrimitive.Root>
</template>

<style scoped src="../button/styles.css"></style>
<style scoped src="./styles.css"></style>
