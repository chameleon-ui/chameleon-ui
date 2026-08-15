<script lang="ts">
export interface CalendarProps {
  value?: string
  locale?: string
  label: string
  previousMonthLabel?: string
  nextMonthLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { buildWeeks, firstDayOfWeek, parseISODate, toISODate, weekdayNames } from './calendar-math.js'

const props = withDefaults(defineProps<CalendarProps>(), {
  locale: 'en',
  previousMonthLabel: 'Previous month',
  nextMonthLabel: 'Next month',
})
const emit = defineEmits<{ select: [isoDate: string] }>()
const view = ref(parseISODate(props.value))
const classes = computed(() => ['cu-calendar', props.class].filter(Boolean).join(' '))
const monthFormat = computed(
  () => new Intl.DateTimeFormat(props.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }),
)
const dayFormat = computed(() => new Intl.NumberFormat(props.locale))
const headline = computed(() => monthFormat.value.format(new Date(Date.UTC(view.value.year, view.value.month, 1))))
const firstDay = computed(() => firstDayOfWeek(props.locale))
const weekdays = computed(() => weekdayNames(props.locale, firstDay.value))
const weeks = computed(() => buildWeeks(view.value.year, view.value.month, firstDay.value))

watch(
  () => props.value,
  (next) => {
    view.value = parseISODate(next)
  },
)

function move(delta: number) {
  const next = new Date(Date.UTC(view.value.year, view.value.month + delta, 1))
  view.value = { year: next.getUTCFullYear(), month: next.getUTCMonth() }
}

function selected(day: number) {
  return props.value === toISODate(view.value.year, view.value.month, day)
}
</script>

<template>
  <div :class="classes" data-ai-role="calendar" data-ai-intent="pick-datetime" data-ai-state="default" :aria-label="label">
    <div class="cu-calendar__header">
      <button type="button" class="cu-calendar__nav" :aria-label="previousMonthLabel" @click="move(-1)">
        <span aria-hidden="true">‹</span>
      </button>
      <span class="cu-calendar__headline">{{ headline }}</span>
      <button type="button" class="cu-calendar__nav" :aria-label="nextMonthLabel" @click="move(1)">
        <span aria-hidden="true">›</span>
      </button>
    </div>
    <div class="cu-calendar__grid" role="grid" :aria-label="headline">
      <div class="cu-calendar__weekdays" role="row">
        <span v-for="(weekday, index) in weekdays" :key="weekday + index" class="cu-calendar__weekday" role="columnheader">
          {{ weekday }}
        </span>
      </div>
      <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="cu-calendar__week" role="row">
        <template v-for="(day, dayIndex) in week" :key="day ?? 'blank-' + weekIndex + '-' + dayIndex">
          <span v-if="day === null" class="cu-calendar__blank" role="gridcell" aria-hidden="true" />
          <span v-else class="cu-calendar__cell" role="gridcell">
            <button type="button" class="cu-calendar__day" :aria-selected="selected(day)" @click="emit('select', toISODate(view.year, view.month, day))">
              {{ dayFormat.format(day) }}
            </button>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped src="./styles.css"></style>
