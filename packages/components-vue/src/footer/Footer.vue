<script lang="ts">
export interface FooterProps {
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<FooterProps>()
const classes = computed(() => ['cu-footer', props.class].filter(Boolean).join(' '))
</script>

<template>
  <div
    :class="classes"
    data-ai-role="footer"
    data-ai-intent="show-attribution"
    data-ai-state="default"
  >
    <slot />
  </div>
</template>

<style src="./styles.css"></style>
