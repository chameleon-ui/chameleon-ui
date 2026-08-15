<script lang="ts">
export interface CodeBlockProps {
  code: string
  language?: string
  highlight?: boolean
  copyLabel?: string
  copiedLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { tokenize } from './tokenize.js'

const props = withDefaults(defineProps<CodeBlockProps>(), {
  highlight: true,
  copyLabel: 'Copy code',
  copiedLabel: 'Copied',
})
const copied = ref(false)
const classes = computed(() => ['cu-code-block', props.class].filter(Boolean).join(' '))
const tokens = computed(() => (props.highlight ? tokenize(props.code) : [{ text: props.code, kind: null }]))

async function copy() {
  try {
    await navigator.clipboard?.writeText(props.code)
  } catch {
    // Clipboard unavailable; the state change still confirms intent.
  }
  copied.value = true
}
</script>

<template>
  <figure :class="classes" data-ai-role="code-block" data-ai-intent="copy-snippet" :data-ai-state="copied ? 'copied' : 'default'">
    <figcaption class="cu-code-block__bar">
      <span class="cu-code-block__language">{{ language ?? 'text' }}</span>
      <button type="button" class="cu-code-block__copy" @click="copy">{{ copied ? copiedLabel : copyLabel }}</button>
    </figcaption>
    <pre class="cu-code-block__pre">
      <code>
        <template v-for="(token, index) in tokens" :key="index">
          <span v-if="token.kind" :class="'cu-code-block__token--' + token.kind">{{ token.text }}</span>
          <template v-else>{{ token.text }}</template>
        </template>
      </code>
    </pre>
  </figure>
</template>

<style scoped src="./styles.css"></style>
