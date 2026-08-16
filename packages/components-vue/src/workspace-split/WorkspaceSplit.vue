<script lang="ts">
/**
 * Who owns overflow when WorkspaceSplit sits in AppShell `__main`.
 * - `shell` (default): panes do not scroll; `__main` grows/scrolls.
 * - `panes`: fill the main scrollport; each pane scrolls.
 * - `none`: no default pane scroll; use ScrollPane / per-pane *Scroll.
 */
export type WorkspaceSplitScrollMode = 'shell' | 'panes' | 'none'

export interface WorkspaceSplitProps {
  masterWidth?: string
  toolsWidth?: string
  /**
   * Documented collapse threshold. Morph uses token-aligned breakpoints
   * (48rem master|detail, 80rem three-pane) via `@container` — custom lengths
   * are not applied.
   */
  collapseBelow?: string
  /**
   * Scroll owner strategy. Default `shell` — do not nest pane overflow under
   * AppShell `__main`. Use `panes` for fixed-viewport dashboards.
   */
  scrollMode?: WorkspaceSplitScrollMode
  /** Per-pane override. When omitted/null, follows `scrollMode` (`panes` → true). */
  masterScroll?: boolean | null
  detailScroll?: boolean | null
  toolsScroll?: boolean | null
  class?: string
}

function resolvePaneScroll(
  mode: WorkspaceSplitScrollMode,
  override?: boolean | null,
): boolean {
  // null/undefined = follow scrollMode. Explicit true/false wins.
  // (Vue Boolean props coerce absent → false unless defaulted to null.)
  if (override === true) return true
  if (override === false) return false
  return mode === 'panes'
}
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<WorkspaceSplitProps>(), {
  masterWidth: '16rem',
  toolsWidth: '16rem',
  collapseBelow: '48rem',
  scrollMode: 'shell',
  // null (not false): Vue Boolean casting would otherwise treat absent as false
  // and break scrollMode="panes".
  masterScroll: null,
  detailScroll: null,
  toolsScroll: null,
})

const slots = useSlots()
const classes = computed(() => ['cu-workspace-split', props.class].filter(Boolean).join(' '))
const style = computed(() => ({
  '--cu-workspace-master-width': props.masterWidth,
  '--cu-workspace-tools-width': props.toolsWidth,
  '--cu-workspace-collapse-below': props.collapseBelow,
}))
const masterClass = computed(() =>
  [
    'cu-workspace-split__master',
    resolvePaneScroll(props.scrollMode ?? 'shell', props.masterScroll)
      ? 'cu-workspace-split__pane--scroll'
      : '',
  ]
    .filter(Boolean)
    .join(' '),
)
const detailClass = computed(() =>
  [
    'cu-workspace-split__detail',
    resolvePaneScroll(props.scrollMode ?? 'shell', props.detailScroll)
      ? 'cu-workspace-split__pane--scroll'
      : '',
  ]
    .filter(Boolean)
    .join(' '),
)
const toolsClass = computed(() =>
  [
    'cu-workspace-split__tools',
    resolvePaneScroll(props.scrollMode ?? 'shell', props.toolsScroll)
      ? 'cu-workspace-split__pane--scroll'
      : '',
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <div
    :class="classes"
    data-ai-role="workspace-split"
    data-ai-intent="layout-split"
    data-ai-state="default"
    :data-scroll-mode="scrollMode ?? 'shell'"
    :style="style"
  >
    <div class="cu-workspace-split__frame">
      <div :class="masterClass">
        <slot name="master" />
      </div>
      <div :class="detailClass">
        <slot name="detail" />
      </div>
      <div v-if="slots.tools" :class="toolsClass">
        <slot name="tools" />
      </div>
    </div>
  </div>
</template>

<style src="./styles.css"></style>
