<script lang="ts">
export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: '/'
})
const classes = computed(() => ["cu-breadcrumb", props.class].filter(Boolean).join(' '))
</script>

<template>
  <nav aria-label="Breadcrumb" :class="classes" data-ai-role="breadcrumb" data-ai-state="default" data-ai-intent="navigate-hierarchy">
    <ol class="cu-breadcrumb__list">
      <li v-for="(item, index) in items" :key="index" class="cu-breadcrumb__item">
        <a v-if="item.href" class="cu-breadcrumb__link" :href="item.href">{{ item.label }}</a>
        <span v-else class="cu-breadcrumb__current" aria-current="page">{{ item.label }}</span>
        <span v-if="index < items.length - 1" class="cu-breadcrumb__separator" aria-hidden="true">{{ separator }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped src="./styles.css"></style>
