<script lang="ts">
export interface FileInputProps {
  label: string
  accept?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<FileInputProps>()
const emit = defineEmits<{ change: [files: FileList | null] }>()
const names = ref<string[]>([])
const classes = computed(() => ["cu-file-input", props.class].filter(Boolean).join(' '))
function onInput(event: Event) {
  const files = (event.currentTarget as HTMLInputElement).files
  names.value = files ? Array.from(files).map((file) => file.name) : []
  emit('change', files)
}
</script>

<template>
  <label :class="classes" data-ai-role="file-input" data-ai-intent="upload-file" :data-ai-state="names.length > 0 ? 'selected' : 'empty'">
    <span class="cu-file-input__label">{{ label }}</span>
    <input :accept="accept" class="cu-file-input__input" type="file" @change="onInput" />
    <span v-if="names.length > 0" class="cu-file-input__names">{{ names.join(', ') }}</span>
  </label>
</template>

<style scoped src="./styles.css"></style>
