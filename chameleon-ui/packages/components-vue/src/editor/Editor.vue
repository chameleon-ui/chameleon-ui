<script lang="ts">
export interface EditorProps {
  label: string
  placeholder?: string
  initialHtml?: string
  boldLabel?: string
  italicLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { sanitizeHtml } from './sanitize.js'

const props = withDefaults(defineProps<EditorProps>(), {
  placeholder: 'Write something',
  initialHtml: '',
  boldLabel: 'Bold',
  italicLabel: 'Italic',
})
const emit = defineEmits<{ change: [html: string] }>()
const regionRef = ref<HTMLDivElement | null>(null)
const empty = ref(props.initialHtml.trim().length === 0)
const classes = computed(() => ['cu-editor', props.class].filter(Boolean).join(' '))

function emitChange() {
  const html = regionRef.value?.innerHTML ?? ''
  empty.value = (regionRef.value?.textContent ?? '').trim().length === 0
  emit('change', html)
}

function run(command: 'bold' | 'italic') {
  regionRef.value?.focus()
  if (typeof document.execCommand === 'function') {
    document.execCommand(command)
    emitChange()
  }
}

onMounted(() => {
  if (regionRef.value) regionRef.value.innerHTML = sanitizeHtml(props.initialHtml)
})
</script>

<template>
  <div :class="classes" data-ai-role="editor" data-ai-intent="compose-rich-text" :data-ai-state="empty ? 'empty' : 'default'">
    <div class="cu-editor__toolbar" role="toolbar" :aria-label="label">
      <button type="button" class="cu-editor__command" :aria-label="boldLabel" @click="run('bold')">
        <strong aria-hidden="true">B</strong>
      </button>
      <button type="button" class="cu-editor__command" :aria-label="italicLabel" @click="run('italic')">
        <em aria-hidden="true">I</em>
      </button>
    </div>
    <div
      ref="regionRef"
      class="cu-editor__region"
      role="textbox"
      :aria-label="label"
      aria-multiline="true"
      contenteditable="true"
      :data-placeholder="placeholder"
      @input="emitChange"
    />
  </div>
</template>

<style scoped src="./styles.css"></style>
