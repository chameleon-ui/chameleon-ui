<script lang="ts">
export interface ImageProps {
  src: string
  alt: string
  caption?: string
  errorLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<ImageProps>(), {
  errorLabel: 'Image failed to load'
})
const failed = ref(false)
const classes = computed(() => ["cu-image", props.class].filter(Boolean).join(' '))
</script>

<template>
  <figure :class="classes" data-ai-role="image" data-ai-intent="signal-meaning" :data-ai-state="failed ? 'error' : 'default'">
    <div v-if="failed" class="cu-image__fallback" role="img" :aria-label="alt">{{ errorLabel }}</div>
    <img v-else class="cu-image__img" :src="src" :alt="alt" loading="lazy" @error="failed = true" />
    <figcaption v-if="caption" class="cu-image__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped src="./styles.css"></style>
