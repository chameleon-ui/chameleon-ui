<script lang="ts">
export type TitleBarDensity = 'default' | 'compact'

export interface TitleBarProps {
  title: string
  subtitle?: string
  logoSrc?: string
  logoAlt?: string
  density?: TitleBarDensity
  homeHref?: string
  brandInteractive?: boolean
  preventContextMenu?: boolean
  userSelectNone?: boolean
  homeLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { BrandMark } from '../brand-mark/index.js'

const props = withDefaults(defineProps<TitleBarProps>(), {
  density: 'default',
  brandInteractive: true,
  preventContextMenu: true,
  userSelectNone: true,
  logoAlt: '',
})

const emit = defineEmits<{
  /** Brand activation — parent typically returns to the home tab. */
  brandClick: [event: MouseEvent | KeyboardEvent]
}>()

const compact = computed(() => props.density === 'compact')
const accessibleName = computed(() => props.homeLabel ?? props.title)
const letter = computed(() => Array.from(props.title.trim())[0] ?? '?')
const markSize = computed(() => (compact.value ? 'sm' : 'md'))
const rootTag = computed((): Component | string => {
  if (!props.brandInteractive) return 'div'
  if (props.homeHref) return 'a'
  return 'div'
})

const classes = computed(() =>
  [
    'cu-title-bar',
    compact.value && 'cu-title-bar--compact',
    props.brandInteractive && 'cu-title-bar--interactive',
    props.userSelectNone && 'cu-title-bar--no-select',
    props.class,
  ]
    .filter(Boolean)
    .join(' '),
)

function onContextMenu(event: MouseEvent) {
  if (props.preventContextMenu) event.preventDefault()
}

function onActivate(event: MouseEvent | KeyboardEvent) {
  emit('brandClick', event)
}

function onKeydown(event: KeyboardEvent) {
  if (!props.brandInteractive) return
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  onActivate(event)
}
</script>

<template>
  <component
    :is="rootTag"
    :class="classes"
    :href="brandInteractive && homeHref ? homeHref : undefined"
    :role="brandInteractive && !homeHref ? 'button' : undefined"
    :tabindex="brandInteractive && !homeHref ? 0 : undefined"
    :aria-label="brandInteractive ? accessibleName : undefined"
    :title="brandInteractive && compact ? title : undefined"
    :data-density="density"
    :data-interactive="brandInteractive ? 'true' : 'false'"
    data-ai-role="title-bar"
    data-ai-intent="navigate"
    :data-ai-state="compact ? 'compact' : 'default'"
    @click="brandInteractive ? onActivate($event) : undefined"
    @keydown="onKeydown"
    @contextmenu="onContextMenu"
  >
    <span class="cu-title-bar__mark">
      <slot name="logo">
        <BrandMark
          v-if="logoSrc"
          :src="logoSrc"
          :alt="logoAlt || title"
          :size="markSize"
        />
        <span v-else class="cu-title-bar__letter" aria-hidden="true">{{ letter }}</span>
      </slot>
    </span>
    <span class="cu-title-bar__text">
      <span class="cu-title-bar__title">{{ title }}</span>
      <span v-if="subtitle" class="cu-title-bar__subtitle">{{ subtitle }}</span>
    </span>
  </component>
</template>

<style src="./styles.css"></style>
