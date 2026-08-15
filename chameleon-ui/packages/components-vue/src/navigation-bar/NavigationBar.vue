<script lang="ts">
export interface NavigationBarProps {
  title: string
  backLabel?: string
  onBack?: () => void
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<NavigationBarProps>(), {
  backLabel: 'Back',
})

const nested = computed(() => Boolean(props.onBack))
const classes = computed(() => ['cu-navigation-bar', props.class].filter(Boolean).join(' '))
</script>

<template>
  <div
    :class="classes"
    data-ai-role="navigation-bar"
    data-ai-intent="navigate-stack"
    :data-ai-state="nested ? 'nested' : 'root'"
  >
    <div class="cu-navigation-bar__frame">
      <div class="cu-navigation-bar__leading">
        <button v-if="onBack" type="button" class="cu-navigation-bar__back" @click="onBack">
          <span aria-hidden="true" class="cu-navigation-bar__back-icon">
            <svg viewBox="0 0 24 24" class="cu-navigation-bar__back-svg">
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </span>
          <span class="cu-navigation-bar__back-label">{{ backLabel }}</span>
        </button>
        <slot v-else name="leading" />
      </div>
      <h1 class="cu-navigation-bar__title">
        <slot name="title">{{ title }}</slot>
      </h1>
      <div class="cu-navigation-bar__trailing">
        <slot name="trailing" />
      </div>
    </div>
  </div>
</template>

<style src="./styles.css"></style>
