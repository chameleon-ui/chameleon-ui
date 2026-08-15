<script lang="ts">
export interface CollapseProps {
  title: string
  defaultOpen?: boolean
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<CollapseProps>(), {
  defaultOpen: false
})
const open = ref(props.defaultOpen)
const classes = computed(() => ["cu-collapse", props.class].filter(Boolean).join(' '))
</script>

<template>
  <div :class="classes" data-ai-role="collapse" data-ai-intent="toggle-visibility" :data-ai-state="open ? 'open' : 'closed'">
    <button class="cu-collapse__trigger" type="button" :aria-expanded="open" @click="open = !open">{{ title }}</button>
    <div v-if="open" class="cu-collapse__content"><slot /></div>
  </div>
</template>

<style scoped src="./styles.css"></style>
