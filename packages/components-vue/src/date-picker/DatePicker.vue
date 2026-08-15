<script lang="ts">
export interface DatePickerProps {
  value: string
  label: string
  locale?: string
  previousMonthLabel?: string
  nextMonthLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { buildWeeks, firstDayOfWeek, parseISODate, toISODate, weekdayNames } from '../calendar/calendar-math.js'

const props = withDefaults(defineProps<DatePickerProps>(), {
  locale: 'en',
  previousMonthLabel: 'Previous month',
  nextMonthLabel: 'Next month',
})
const emit = defineEmits<{ change: [isoDate: string] }>()
const open = ref(false)
const view = ref(parseISODate(props.value))
const inputRef = ref<HTMLInputElement | null>(null)
const inputId = useId()
const classes = computed(() => ['cu-date-picker', props.class].filter(Boolean).join(' '))
const dateFormat = computed(() => new Intl.DateTimeFormat(props.locale, { dateStyle: 'medium', timeZone: 'UTC' }))
const monthFormat = computed(
  () => new Intl.DateTimeFormat(props.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }),
)
const dayFormat = computed(() => new Intl.NumberFormat(props.locale))
const display = computed(() => {
  const parsed = props.value ? new Date(`${props.value}T00:00:00Z`) : null
  return parsed && !Number.isNaN(parsed.getTime()) ? dateFormat.value.format(parsed) : ''
})
const headline = computed(() => monthFormat.value.format(new Date(Date.UTC(view.value.year, view.value.month, 1))))
const firstDay = computed(() => firstDayOfWeek(props.locale))
const weekdays = computed(() => weekdayNames(props.locale, firstDay.value))
const weeks = computed(() => buildWeeks(view.value.year, view.value.month, firstDay.value))

function close() {
  open.value = false
  inputRef.value?.focus()
}

function openPicker() {
  view.value = parseISODate(props.value)
  open.value = true
}

function move(delta: number) {
  const next = new Date(Date.UTC(view.value.year, view.value.month + delta, 1))
  view.value = { year: next.getUTCFullYear(), month: next.getUTCMonth() }
}

function pick(day: number) {
  emit('change', toISODate(view.value.year, view.value.month, day))
  close()
}

function onFieldKey(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openPicker()
  }
}
</script>

<template>
  <div :class="classes" data-ai-role="date-picker" data-ai-intent="pick-datetime" :data-ai-state="open ? 'open' : 'closed'">
    <label class="cu-date-picker__label" :for="inputId">{{ label }}</label>
    <div class="cu-date-picker__field">
      <input
        :id="inputId"
        ref="inputRef"
        class="cu-date-picker__input"
        type="text"
        readonly
        :value="display"
        :aria-expanded="open"
        aria-haspopup="dialog"
        @click="openPicker"
        @keydown="onFieldKey"
      />
      <button type="button" class="cu-date-picker__toggle" :aria-label="label" @click="open ? close() : openPicker()">
        <span aria-hidden="true">▾</span>
      </button>
    </div>
    <div v-if="open" class="cu-date-picker__popover" role="dialog" :aria-label="headline" @keydown.escape="close">
      <div class="cu-date-picker__header">
        <button type="button" class="cu-date-picker__nav" :aria-label="previousMonthLabel" @click="move(-1)">
          <span aria-hidden="true">‹</span>
        </button>
        <span class="cu-date-picker__headline">{{ headline }}</span>
        <button type="button" class="cu-date-picker__nav" :aria-label="nextMonthLabel" @click="move(1)">
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <div class="cu-date-picker__grid" role="grid" :aria-label="headline">
        <div class="cu-date-picker__weekdays" role="row">
          <span v-for="(weekday, index) in weekdays" :key="weekday + index" class="cu-date-picker__weekday" role="columnheader">
            {{ weekday }}
          </span>
        </div>
        <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="cu-date-picker__week" role="row">
          <template v-for="(day, dayIndex) in week" :key="day ?? 'blank-' + weekIndex + '-' + dayIndex">
            <span v-if="day === null" class="cu-date-picker__blank" role="gridcell" aria-hidden="true" />
            <span v-else class="cu-date-picker__cell" role="gridcell">
              <button
                type="button"
                class="cu-date-picker__day"
                :aria-selected="value === toISODate(view.year, view.month, day)"
                @click="pick(day)"
              >
                {{ dayFormat.format(day) }}
              </button>
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./styles.css"></style>
