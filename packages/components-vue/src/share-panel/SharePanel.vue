<script lang="ts">
export type ShareTarget = 'x' | 'linkedin' | 'email' | 'copy'

export interface SharePanelProps {
  title: string
  url: string
  targets?: ShareTarget[]
  copyLabel?: string
  class?: string
}

const TARGET_LABEL: Record<Exclude<ShareTarget, 'copy'>, string> = {
  x: 'X',
  linkedin: 'LinkedIn',
  email: 'Email',
}

function targetHref(target: Exclude<ShareTarget, 'copy'>, url: string, title: string) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  if (target === 'x') return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  if (target === 'linkedin') return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  return `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<SharePanelProps>(), {
  targets: () => ['x', 'linkedin', 'email', 'copy'],
  copyLabel: 'Copy link',
})
const copied = ref(false)
const classes = computed(() => ['cu-share-panel', props.class].filter(Boolean).join(' '))

async function copy() {
  try {
    await navigator.clipboard?.writeText(props.url)
  } catch {
    // Clipboard unavailable; still surface the confirmation affordance.
  }
  copied.value = true
}
</script>

<template>
  <div :class="classes" role="group" :aria-label="title" data-ai-role="share-panel" data-ai-intent="share-content" :data-ai-state="copied ? 'copied' : 'default'">
    <p class="cu-share-panel__title">{{ title }}</p>
    <div class="cu-share-panel__targets">
      <template v-for="target in targets" :key="target">
        <button v-if="target === 'copy'" type="button" class="cu-share-panel__target" @click="copy">{{ copied ? '✓ ' : '' }}{{ copyLabel }}</button>
        <a v-else class="cu-share-panel__target" :href="targetHref(target, url, title)" target="_blank" rel="noreferrer">{{ TARGET_LABEL[target] }}</a>
      </template>
    </div>
    <p class="cu-share-panel__url">{{ url }}</p>
  </div>
</template>

<style scoped src="./styles.css"></style>
