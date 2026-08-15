<script lang="ts">
export interface ChatBubbleProps {
  role?: 'user' | 'assistant' | 'system'
  time?: string
  status?: 'streaming' | 'sent' | 'error'
  statusLabel?: string
  avatarSrc?: string
  avatarAlt?: string
  label?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<ChatBubbleProps>(), { role: 'assistant', avatarAlt: '' })
const classes = computed(() =>
  ['cu-chat-bubble', 'cu-chat-bubble--' + props.role, props.status ? 'cu-chat-bubble--' + props.status : undefined, props.class]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <article :class="classes" :aria-label="label ?? role" data-ai-role="chat-bubble" data-ai-intent="notify-status" :data-ai-state="status ?? role">
    <img v-if="avatarSrc" class="cu-chat-bubble__avatar" :src="avatarSrc" :alt="avatarAlt" />
    <div class="cu-chat-bubble__content">
      <div class="cu-chat-bubble__meta">
        <span class="cu-chat-bubble__role">{{ role }}</span>
        <time v-if="time" class="cu-chat-bubble__time">{{ time }}</time>
        <span v-if="statusLabel" class="cu-chat-bubble__status">{{ statusLabel }}</span>
      </div>
      <div class="cu-chat-bubble__body" :aria-live="status === 'streaming' ? 'polite' : undefined"><slot /></div>
    </div>
  </article>
</template>

<style scoped src="./styles.css"></style>
