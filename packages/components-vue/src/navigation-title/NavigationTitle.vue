<script lang="ts">
export interface NavigationTitleProps {
  title: string
  backLabel?: string
  onBack?: () => void
  class?: string
}

/** @deprecated Use `NavigationTitleProps`. Kept for EraseLab / consumer continuity. */
export type NavigationBarProps = NavigationTitleProps
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<NavigationTitleProps>(), {
  backLabel: 'Back',
})

const nested = computed(() => Boolean(props.onBack))
// Dual root class during rename: cu-navigation-title canonical, cu-navigation-bar legacy.
const classes = computed(() =>
  ['cu-navigation-title', 'cu-navigation-bar', props.class].filter(Boolean).join(' '),
)
</script>

<template>
  <div
    :class="classes"
    data-ai-role="navigation-title"
    data-ai-intent="navigate-stack"
    :data-ai-state="nested ? 'nested' : 'root'"
  >
    <div class="cu-navigation-title__frame cu-navigation-bar__frame">
      <div class="cu-navigation-title__leading cu-navigation-bar__leading">
        <button
          v-if="onBack"
          type="button"
          class="cu-navigation-title__back cu-navigation-bar__back"
          @click="onBack"
        >
          <span aria-hidden="true" class="cu-navigation-title__back-icon cu-navigation-bar__back-icon">
            <svg viewBox="0 0 24 24" class="cu-navigation-title__back-svg cu-navigation-bar__back-svg">
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
          <span class="cu-navigation-title__back-label cu-navigation-bar__back-label">{{ backLabel }}</span>
        </button>
        <slot v-else name="leading" />
      </div>
      <h1 class="cu-navigation-title__title cu-navigation-bar__title">
        <slot name="title">{{ title }}</slot>
      </h1>
      <div class="cu-navigation-title__trailing cu-navigation-bar__trailing">
        <slot name="trailing" />
      </div>
    </div>
  </div>
</template>

<style src="./styles.css"></style>
