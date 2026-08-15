<script lang="ts">
export interface KpiItem {
  id: string
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
}

export interface KpiDashboardProps {
  items: KpiItem[]
  label?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Statistic } from '../statistic/index.js'

const props = withDefaults(defineProps<KpiDashboardProps>(), { label: 'KPI dashboard' })
const classes = computed(() => ['cu-kpi-dashboard', props.class].filter(Boolean).join(' '))
</script>

<template>
  <section :class="classes" :aria-label="label" data-ai-role="kpi-dashboard" data-ai-intent="highlight-count" :data-ai-state="items.length === 0 ? 'empty' : 'default'">
    <div class="cu-kpi-dashboard__grid">
      <div v-for="item in items" :key="item.id" class="cu-kpi-dashboard__tile">
        <Statistic :label="item.label" :value="item.value" :trend="item.trend ?? 'flat'" :trend-label="item.trend" />
      </div>
    </div>
  </section>
</template>

<style scoped src="./styles.css"></style>
