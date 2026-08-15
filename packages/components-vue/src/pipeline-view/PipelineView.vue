<script lang="ts">
export interface PipelineStage {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'failed'
}

export interface PipelineViewProps {
  stages: PipelineStage[]
  label: string
  statusLabels?: Partial<Record<PipelineStage['status'], string>>
  class?: string
}

const DEFAULT_STATUS_LABELS: Record<PipelineStage['status'], string> = {
  pending: 'Pending',
  running: 'Running',
  success: 'Succeeded',
  failed: 'Failed',
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<PipelineViewProps>()
const classes = computed(() => ['cu-pipeline-view', props.class].filter(Boolean).join(' '))
const labels = computed(() => ({ ...DEFAULT_STATUS_LABELS, ...props.statusLabels }))
</script>

<template>
  <section :class="classes" :aria-label="label" data-ai-role="pipeline-view" data-ai-intent="show-progress" :data-ai-state="stages.length === 0 ? 'empty' : 'default'">
    <ol class="cu-pipeline-view__stages">
      <li v-for="stage in stages" :key="stage.id" :class="'cu-pipeline-view__stage cu-pipeline-view__stage--' + stage.status">
        <span class="cu-pipeline-view__name">{{ stage.name }}</span>
        <span class="cu-pipeline-view__status">{{ labels[stage.status] }}</span>
      </li>
    </ol>
  </section>
</template>

<style scoped src="./styles.css"></style>
