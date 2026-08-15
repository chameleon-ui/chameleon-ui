<script lang="ts">
export interface NavbarItem {
  value: string
  label: string
  href?: string
}

export interface NavbarProps {
  label: string
  items: NavbarItem[]
  activeValue?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = defineProps<NavbarProps>()
const emit = defineEmits<{ select: [value: string] }>()
const slots = useSlots()
const classes = computed(() => ['cu-navbar', props.class].filter(Boolean).join(' '))
</script>

<template>
  <nav :class="classes" :aria-label="label" data-ai-role="navbar" data-ai-intent="navigate-sections" :data-ai-state="activeValue ? 'active' : 'default'">
    <div class="cu-navbar__frame">
      <div v-if="slots.brand" class="cu-navbar__brand"><slot name="brand" /></div>
      <ul class="cu-navbar__list">
        <li v-for="item in items" :key="item.value" class="cu-navbar__entry">
          <a
            v-if="item.href"
            class="cu-navbar__item"
            :href="item.href"
            :aria-current="activeValue === item.value ? 'page' : undefined"
            @click="emit('select', item.value)"
          >
            <span class="cu-navbar__label">{{ item.label }}</span>
          </a>
          <button
            v-else
            type="button"
            class="cu-navbar__item"
            :aria-current="activeValue === item.value ? 'page' : undefined"
            @click="emit('select', item.value)"
          >
            <span class="cu-navbar__label">{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped src="./styles.css"></style>
