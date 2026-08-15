<script lang="ts">
export interface ActionSheetAction {
  value: string
  label: string
}

export interface ActionSheetProps {
  triggerLabel: string
  title: string
  cancelLabel: string
  actions: ActionSheetAction[]
  open?: boolean
  class?: string
}

const DISMISS_THRESHOLD_PX = 72
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DialogPrimitive } from '@chameleon-ui/primitives-vue'

const props = defineProps<ActionSheetProps>()
const emit = defineEmits<{ openChange: [open: boolean]; action: [value: string] }>()
const internalOpen = ref(false)
const isOpen = computed(() => props.open ?? internalOpen.value)
const contentRef = ref<HTMLElement | null>(null)
const drag = ref<{ pointerId: number; startY: number; delta: number } | null>(null)
const classes = computed(() => ['cu-action-sheet', 'cu-action-sheet__content', props.class].filter(Boolean).join(' '))

function requestOpenChange(next: boolean) {
  if (props.open === undefined) internalOpen.value = next
  emit('openChange', next)
}

function applyDragOffset(delta: number) {
  const content = contentRef.value
  if (!content) return
  content.style.transform = delta > 0 ? `translateY(${delta}px)` : ''
}

function onHandlePointerDown(event: PointerEvent) {
  drag.value = { pointerId: event.pointerId, startY: event.clientY, delta: 0 }
  try {
    ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
  } catch {
    // jsdom has no pointer capture
  }
}

function onHandlePointerMove(event: PointerEvent) {
  if (drag.value?.pointerId !== event.pointerId) return
  drag.value.delta = Math.max(0, event.clientY - drag.value.startY)
  applyDragOffset(drag.value.delta)
}

function onHandlePointerEnd(event: PointerEvent) {
  if (drag.value?.pointerId !== event.pointerId) return
  const { delta } = drag.value
  drag.value = null
  applyDragOffset(0)
  if (delta > DISMISS_THRESHOLD_PX) requestOpenChange(false)
}

function choose(value: string) {
  emit('action', value)
  requestOpenChange(false)
}
</script>

<template>
  <DialogPrimitive.Root :open="isOpen" @open-change="(details: { open: boolean }) => requestOpenChange(details.open)">
    <DialogPrimitive.Trigger class="cu-action-sheet__trigger">{{ triggerLabel }}</DialogPrimitive.Trigger>
    <Teleport to="body">
      <DialogPrimitive.Backdrop class="cu-action-sheet__backdrop" />
      <DialogPrimitive.Positioner class="cu-action-sheet__positioner">
        <DialogPrimitive.Content
          ref="contentRef"
          :class="classes"
          data-ai-role="action-sheet"
          data-ai-intent="choose-action"
          :data-ai-state="isOpen ? 'open' : 'closed'"
        >
          <span
            class="cu-action-sheet__handle"
            aria-hidden="true"
            @pointerdown="onHandlePointerDown"
            @pointermove="onHandlePointerMove"
            @pointerup="onHandlePointerEnd"
            @pointercancel="onHandlePointerEnd"
          />
          <DialogPrimitive.Title class="cu-action-sheet__title">{{ title }}</DialogPrimitive.Title>
          <div class="cu-action-sheet__actions">
            <button v-for="item in actions" :key="item.value" type="button" class="cu-action-sheet__action" @click="choose(item.value)">{{ item.label }}</button>
          </div>
          <DialogPrimitive.CloseTrigger class="cu-action-sheet__cancel">{{ cancelLabel }}</DialogPrimitive.CloseTrigger>
        </DialogPrimitive.Content>
      </DialogPrimitive.Positioner>
    </Teleport>
  </DialogPrimitive.Root>
</template>

<style src="./styles.css"></style>
