<script lang="ts">
export interface SelectableListItemProps {
  selected?: boolean
  disabled?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<SelectableListItemProps>(), {
  selected: false,
  disabled: false,
})

const emit = defineEmits<{
  select: []
}>()

const slots = useSlots()
const classes = computed(() => ['cu-selectable-list-item', props.class].filter(Boolean).join(' '))
const aiState = computed(() => (props.disabled ? 'disabled' : props.selected ? 'selected' : 'default'))

function activate() {
  if (props.disabled) return
  emit('select')
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    activate()
  }
}

function onActionsClick(event: MouseEvent) {
  event.stopPropagation()
}
</script>

<template>
  <div
    :class="classes"
    role="option"
    :tabindex="disabled ? -1 : 0"
    :aria-selected="selected"
    :aria-disabled="disabled || undefined"
    :data-selected="selected ? 'true' : 'false'"
    :data-disabled="disabled ? 'true' : 'false'"
    data-ai-role="selectable-list-item"
    data-ai-intent="select-single"
    :data-ai-state="aiState"
    @click="activate"
    @keydown="onKeyDown"
  >
    <div class="cu-selectable-list-item__row">
      <div v-if="slots.leading" class="cu-selectable-list-item__leading">
        <slot name="leading" />
      </div>
      <div class="cu-selectable-list-item__body">
        <slot />
        <div v-if="slots.meta" class="cu-selectable-list-item__meta">
          <slot name="meta" />
        </div>
      </div>
    </div>
    <div v-if="slots.actions" class="cu-selectable-list-item__actions" @click="onActionsClick">
      <slot name="actions" />
    </div>
  </div>
</template>

<style src="./styles.css"></style>
