<script lang="ts">
export interface TimePickerProps {
  value: string
  label: string
  hourLabel?: string
  minuteLabel?: string
  locale?: string
  class?: string
}

function parseTime(value: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value)
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) return null
  return { hour, minute }
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<TimePickerProps>(), { hourLabel: 'Hour', minuteLabel: 'Minute', locale: 'en' })
const emit = defineEmits<{ change: [value: string] }>()
const classes = computed(() => ['cu-time-picker', props.class].filter(Boolean).join(' '))
const parsed = computed(() => parseTime(props.value))
const numberFormat = computed(() => new Intl.NumberFormat(props.locale, { minimumIntegerDigits: 2, useGrouping: false }))
const hours = Array.from({ length: 24 }, (_, hour) => hour)
const minutes = Array.from({ length: 60 }, (_, minute) => minute)

function emitTime(hour: number, minute: number) {
  emit('change', `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
}
</script>

<template>
  <div :class="classes" role="group" :aria-label="label" data-ai-role="time-picker" data-ai-intent="pick-datetime" data-ai-state="default">
    <label class="cu-time-picker__field">
      <span class="cu-time-picker__label">{{ hourLabel }}</span>
      <select class="cu-time-picker__select" :value="parsed?.hour ?? ''" @change="emitTime(Number(($event.target as HTMLSelectElement).value), parsed?.minute ?? 0)">
        <option value="" disabled>--</option>
        <option v-for="hour in hours" :key="hour" :value="hour">{{ numberFormat.format(hour) }}</option>
      </select>
    </label>
    <span class="cu-time-picker__separator" aria-hidden="true">:</span>
    <label class="cu-time-picker__field">
      <span class="cu-time-picker__label">{{ minuteLabel }}</span>
      <select class="cu-time-picker__select" :value="parsed?.minute ?? ''" @change="emitTime(parsed?.hour ?? 0, Number(($event.target as HTMLSelectElement).value))">
        <option value="" disabled>--</option>
        <option v-for="minute in minutes" :key="minute" :value="minute">{{ numberFormat.format(minute) }}</option>
      </select>
    </label>
  </div>
</template>

<style scoped src="./styles.css"></style>
