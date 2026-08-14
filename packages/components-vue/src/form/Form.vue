<script lang="ts">
export interface FormProps {
  submitLabel: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '../button/Button.vue'

const props = defineProps<FormProps>()

const emit = defineEmits<{
  submit: [event: Event]
}>()

const classes = computed(() => ['cu-form', props.class].filter(Boolean).join(' '))

function onSubmit(event: Event) {
  emit('submit', event)
}
</script>

<template>
  <form :class="classes" data-ai-role="form" data-ai-intent="submit-data" data-ai-state="default" @submit="onSubmit">
    <slot />
    <div class="cu-form__actions">
      <Button type="submit">{{ submitLabel }}</Button>
    </div>
  </form>
</template>

<style scoped src="./styles.css"></style>
