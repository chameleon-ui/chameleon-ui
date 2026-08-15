<script lang="ts">
export interface RadioCardProps {
  options: string[]
  value?: string
  name: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RadioGroupPrimitive } from '@chameleon-ui/primitives-vue'

const props = withDefaults(defineProps<RadioCardProps>(), { value: '' })
const emit = defineEmits<{ change: [value: string] }>()
const classes = computed(() => ['cu-radio-card', props.class].filter(Boolean).join(' '))

function onValueChange(details: { value: string | null }) {
  emit('change', details.value ?? '')
}
</script>

<template>
  <RadioGroupPrimitive.Root
    :class="classes"
    data-ai-role="radio-card"
    data-ai-intent="select-single"
    :data-ai-state="value ? 'checked' : 'unchecked'"
    :name="name"
    :model-value="value || null"
    @value-change="onValueChange"
  >
    <RadioGroupPrimitive.Item v-for="option in options" :key="option" class="cu-radio-card__item" :value="option">
      <RadioGroupPrimitive.ItemControl class="cu-radio-card__control" />
      <RadioGroupPrimitive.ItemText class="cu-radio-card__text">{{ option }}</RadioGroupPrimitive.ItemText>
    </RadioGroupPrimitive.Item>
  </RadioGroupPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
