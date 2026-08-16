<script setup lang="ts">
import { directionForLocale } from '@chameleon-ui/i18n'
import { watchEffect } from 'vue'
import { isThemeId, OVERLAY_STYLE_ID, type ThemeId, type ThemeProviderProps } from './theme'

const props = defineProps<ThemeProviderProps>()

watchEffect(() => {
  if (typeof document === 'undefined' || !isThemeId(props.theme)) return
  const root = document.documentElement
  root.dataset.theme = props.theme
  if (props.density) root.dataset.density = props.density
  else delete root.dataset.density
  if (props.colorScheme) root.dataset.colorScheme = props.colorScheme
  else delete root.dataset.colorScheme
  if (props.locale) {
    root.lang = props.locale
    root.dir = directionForLocale(props.locale)
  }
  if (props.overlays) {
    let style = document.getElementById(OVERLAY_STYLE_ID)
    if (!style) {
      style = document.createElement('style')
      style.id = OVERLAY_STYLE_ID
      document.head.append(style)
    }
    style.textContent = (Object.entries(props.overlays) as Array<[ThemeId, string | undefined]>)
      .filter((entry): entry is [ThemeId, string] => typeof entry[1] === 'string' && isThemeId(entry[0]))
      .map(([id, css]) => css.replaceAll(':root', `[data-theme="${id}"]`))
      .join('\n')
  }
})
</script>

<template>
  <slot />
</template>
