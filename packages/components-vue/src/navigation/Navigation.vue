<script setup lang="ts">
import { computed, ref, useId, useSlots } from 'vue'
import { splitNavigationItems, type NavigationProps } from './split'

const props = withDefaults(defineProps<NavigationProps>(), {
  maxCompactItems: 4,
  moreLabel: 'More',
  collapsible: true,
  defaultCollapsed: false,
  expandLabel: 'Expand navigation',
  collapseLabel: 'Collapse navigation',
})

const emit = defineEmits<{
  select: [value: string]
  collapsedChange: [collapsed: boolean]
}>()

const slots = useSlots()
const internalCollapsed = ref(props.defaultCollapsed)
const internalActive = ref(props.defaultValue ?? props.items[0]?.value)
const moreOpen = ref(false)
const listId = useId()
const overflowId = useId()

const isCollapsed = computed(() => props.collapsed ?? internalCollapsed.value)
const current = computed(() => props.activeValue ?? internalActive.value)
const split = computed(() => splitNavigationItems(props.items, props.maxCompactItems))
const overflowActive = computed(() => split.value.overflow.some((item) => item.value === current.value))
const showToggle = computed(() => props.collapsible && !slots.footer)
const classes = computed(() =>
  ['cu-navigation', isCollapsed.value && 'cu-navigation--collapsed', props.class].filter(Boolean).join(' '),
)

function requestCollapsedChange(next: boolean) {
  if (props.collapsed === undefined) internalCollapsed.value = next
  emit('collapsedChange', next)
}

function select(value: string) {
  if (props.activeValue === undefined) internalActive.value = value
  emit('select', value)
  moreOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') moreOpen.value = false
}
</script>

<template>
  <nav
    :class="classes"
    :aria-label="label"
    data-ai-role="navigation"
    data-ai-intent="navigate-sections"
    :data-ai-state="isCollapsed ? 'collapsed' : 'expanded'"
    :data-more="moreOpen ? 'open' : 'closed'"
    @keydown="onKeydown"
  >
    <div class="cu-navigation__frame">
      <div v-if="slots.header" class="cu-navigation__header">
        <slot name="header" />
      </div>
      <ul :id="listId" class="cu-navigation__list">
        <li v-for="item in split.compact" :key="item.value" class="cu-navigation__entry">
          <button
            type="button"
            class="cu-navigation__item"
            :aria-current="current === item.value ? 'page' : undefined"
            :aria-label="item.label"
            @click="select(item.value)"
          >
            <span class="cu-navigation__label">{{ item.label }}</span>
          </button>
        </li>
        <li v-if="split.overflow.length > 0" class="cu-navigation__overflow">
          <ul :id="overflowId" class="cu-navigation__overflow-list">
            <li v-for="item in split.overflow" :key="item.value" class="cu-navigation__entry">
              <button
                type="button"
                class="cu-navigation__item"
                :aria-current="current === item.value ? 'page' : undefined"
                :aria-label="item.label"
                @click="select(item.value)"
              >
                <span class="cu-navigation__label">{{ item.label }}</span>
              </button>
            </li>
          </ul>
        </li>
        <li v-if="split.overflow.length > 0" class="cu-navigation__entry cu-navigation__entry--more">
          <button
            type="button"
            class="cu-navigation__item"
            :aria-expanded="moreOpen"
            :aria-controls="overflowId"
            :aria-current="overflowActive ? 'page' : undefined"
            @click="moreOpen = !moreOpen"
          >
            <span class="cu-navigation__label">{{ moreLabel }}</span>
          </button>
        </li>
      </ul>
      <div v-if="slots.footer" class="cu-navigation__footer">
        <slot name="footer" />
      </div>
      <button
        v-if="showToggle"
        type="button"
        class="cu-navigation__toggle"
        :aria-expanded="!isCollapsed"
        :aria-controls="listId"
        :aria-label="isCollapsed ? expandLabel : collapseLabel"
        @click="requestCollapsedChange(!isCollapsed)"
      >
        <span
          aria-hidden="true"
          class="cu-navigation__toggle-icon"
          :data-direction="isCollapsed ? 'expand' : 'collapse'"
        >
          <svg viewBox="0 0 24 24" class="cu-navigation__toggle-svg">
            <path
              :d="isCollapsed ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </span>
        <span class="cu-navigation__label">{{ isCollapsed ? expandLabel : collapseLabel }}</span>
      </button>
    </div>
  </nav>
</template>

<style src="./styles.css"></style>
