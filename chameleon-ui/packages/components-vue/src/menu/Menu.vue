<script lang="ts">
export interface MenuItem {
  label: string
  onClick: () => void
}

export interface MenuProps {
  triggerLabel: string
  items: MenuItem[]
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { PopoverPrimitive } from '@chameleon-ui/primitives-vue'

const props = defineProps<MenuProps>()
const classes = computed(() => ['cu-menu', props.class].filter(Boolean).join(' '))
</script>

<template>
  <PopoverPrimitive.Root>
    <PopoverPrimitive.Trigger class="cu-menu__trigger">{{ triggerLabel }}</PopoverPrimitive.Trigger>
    <PopoverPrimitive.Positioner>
      <PopoverPrimitive.Content :class="classes" data-ai-role="menu" data-ai-state="open" data-ai-intent="choose-action" role="menu">
        <ul class="cu-menu__list">
          <li v-for="(item, index) in items" :key="index" class="cu-menu__item">
            <button class="cu-menu__button" type="button" role="menuitem" @click="item.onClick">{{ item.label }}</button>
          </li>
        </ul>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Root>
</template>

<style scoped src="./styles.css"></style>
