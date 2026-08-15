<script lang="ts">
export interface KbdProps {
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<KbdProps>()
const classes = computed(() => ["cu-kbd", props.class].filter(Boolean).join(' '))
</script>

<template>
  <kbd :class="classes" data-ai-role="kbd" data-ai-state="default" data-ai-intent="show-shortcut"><slot /></kbd>
</template>

<style scoped src="./styles.css"></style>
