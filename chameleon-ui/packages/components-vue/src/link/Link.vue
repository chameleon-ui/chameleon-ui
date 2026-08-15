<script lang="ts">
export interface LinkProps {
  href: string
  external?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<LinkProps>(), {
  external: false
})
const classes = computed(() => ["cu-link", props.class].filter(Boolean).join(' '))
</script>

<template>
  <a
    :class="classes"
    data-ai-role="link"
    data-ai-state="default"
    data-ai-intent="navigate"
    :href="href"
    :rel="external ? 'noopener noreferrer' : undefined"
    :target="external ? '_blank' : undefined"
  ><slot /></a>
</template>

<style scoped src="./styles.css"></style>
