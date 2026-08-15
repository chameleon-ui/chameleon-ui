<script lang="ts">
export interface PaginationProps {
  currentPage: number
  totalPages: number
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<PaginationProps>()
const emit = defineEmits<{ change: [page: number] }>()
const classes = computed(() => ['cu-pagination', props.class].filter(Boolean).join(' '))
const pages = computed(() => Array.from({ length: props.totalPages }, (_, i) => i + 1))
</script>

<template>
  <nav aria-label="Pagination" :class="classes" data-ai-role="pagination" data-ai-state="default" data-ai-intent="navigate-pages">
    <div class="cu-pagination__list">
      <button class="cu-pagination__button" type="button" :disabled="currentPage <= 1" @click="emit('change', currentPage - 1)">Previous</button>
      <button
        v-for="page in pages"
        :key="page"
        :aria-current="page === currentPage ? 'page' : undefined"
        :class="'cu-pagination__button' + (page === currentPage ? ' cu-pagination__button--current' : '')"
        type="button"
        @click="emit('change', page)"
      >{{ page }}</button>
      <button class="cu-pagination__button" type="button" :disabled="currentPage >= totalPages" @click="emit('change', currentPage + 1)">Next</button>
    </div>
  </nav>
</template>

<style scoped src="./styles.css"></style>
