<script lang="ts">
export interface NotificationProps {
  title: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  dismissLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'

const props = withDefaults(defineProps<NotificationProps>(), {
  variant: 'info',
  dismissLabel: 'Dismiss'
})
const emit = defineEmits<{ dismiss: [] }>()
const instance = getCurrentInstance()
const hasDismiss = computed(() => typeof instance?.vnode.props?.onDismiss === 'function')
const classes = computed(() => ["cu-notification", 'cu-notification--' + props.variant, props.class].filter(Boolean).join(' '))
</script>

<template>
  <div :class="classes" role="status" data-ai-role="notification" data-ai-intent="notify-status" :data-ai-state="variant">
    <div class="cu-notification__body">
      <p class="cu-notification__title">{{ title }}</p>
      <p class="cu-notification__message">{{ message }}</p>
    </div>
    <button v-if="hasDismiss" type="button" class="cu-notification__dismiss" :aria-label="dismissLabel" @click="emit('dismiss')">×</button>
  </div>
</template>

<style scoped src="./styles.css"></style>
