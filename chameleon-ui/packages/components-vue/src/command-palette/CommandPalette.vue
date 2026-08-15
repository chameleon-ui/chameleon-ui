<script lang="ts">
export interface CommandPaletteProps {
  open: boolean
  commands: import('./filter.js').CommandItem[]
  query?: string
  label: string
  placeholder?: string
  emptyLabel?: string
  closeLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { filterCommands, type CommandItem } from './filter.js'

const props = withDefaults(defineProps<CommandPaletteProps>(), {
  placeholder: 'Type a command',
  emptyLabel: 'No commands',
  closeLabel: 'Close',
})
const emit = defineEmits<{
  openChange: [open: boolean]
  queryChange: [query: string]
  select: [value: string]
}>()
const listId = useId()
const internalQuery = ref('')
const activeIndex = ref(0)
const currentQuery = computed(() => props.query ?? internalQuery.value)
const visible = computed(() => filterCommands(props.commands, currentQuery.value))
const classes = computed(() => ['cu-command-palette', props.class].filter(Boolean).join(' '))
const aiState = computed(() =>
  props.open ? (currentQuery.value.trim().length > 0 ? 'filtered' : 'open') : 'closed',
)
const active = computed(() => visible.value[activeIndex.value])
const activeId = computed(() => (active.value ? `${listId}-${active.value.value}` : undefined))

function setQuery(next: string) {
  if (props.query === undefined) internalQuery.value = next
  emit('queryChange', next)
  activeIndex.value = 0
}

function selectValue(value: string) {
  emit('select', value)
  emit('openChange', false)
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = visible.value.length === 0 ? 0 : (activeIndex.value + 1) % visible.value.length
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value =
      visible.value.length === 0 ? 0 : (activeIndex.value - 1 + visible.value.length) % visible.value.length
  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (active.value) selectValue(active.value.value)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    emit('openChange', false)
  }
}
</script>

<template>
  <div v-if="!open" :class="classes" data-ai-role="command-palette" data-ai-intent="choose-action" data-ai-state="closed" hidden />
  <div v-else :class="classes" data-ai-role="command-palette" data-ai-intent="choose-action" :data-ai-state="aiState">
    <div class="cu-command-palette__backdrop" />
    <div class="cu-command-palette__positioner">
      <div class="cu-command-palette__content" role="dialog" aria-modal="true" :aria-label="label">
        <div class="cu-command-palette__toolbar">
          <label class="cu-command-palette__field">
            <span class="cu-command-palette__field-text">{{ label }}</span>
            <input
              class="cu-command-palette__input"
              type="search"
              role="combobox"
              aria-expanded="true"
              :aria-controls="listId"
              :aria-activedescendant="activeId"
              aria-autocomplete="list"
              :value="currentQuery"
              :placeholder="placeholder"
              @input="setQuery(($event.target as HTMLInputElement).value)"
              @keydown="onKeyDown"
            />
          </label>
          <button type="button" class="cu-command-palette__close" :aria-label="closeLabel" @click="emit('openChange', false)">
            ×
          </button>
        </div>
        <p v-if="visible.length === 0" class="cu-command-palette__empty">{{ emptyLabel }}</p>
        <ul v-else class="cu-command-palette__list" role="listbox" :id="listId">
          <li
            v-for="(command, index) in visible"
            :id="listId + '-' + command.value"
            :key="command.value"
            :class="'cu-command-palette__option' + (index === activeIndex ? ' cu-command-palette__option--active' : '')"
            role="option"
            :aria-selected="index === activeIndex"
            @click="selectValue(command.value)"
          >
            <span class="cu-command-palette__option-label">{{ command.label }}</span>
            <kbd v-if="command.shortcut" class="cu-command-palette__shortcut">{{ command.shortcut }}</kbd>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style src="./styles.css"></style>
