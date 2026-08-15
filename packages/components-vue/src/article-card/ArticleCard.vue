<script lang="ts">
export interface ArticleCardProps {
  title: string
  excerpt?: string
  author?: string
  date?: string
  coverSrc?: string
  coverAlt?: string
  href?: string
  readLabel?: string
  class?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<ArticleCardProps>(), {
  coverAlt: '',
  readLabel: 'Read article'
})
const classes = computed(() => ["cu-article-card", props.class].filter(Boolean).join(' '))
</script>

<template>
  <article :class="classes" data-ai-role="article-card" data-ai-intent="group-content" data-ai-state="default">
    <img v-if="coverSrc" class="cu-article-card__cover" :src="coverSrc" :alt="coverAlt" loading="lazy" />
    <div class="cu-article-card__body">
      <h3 class="cu-article-card__title">{{ title }}</h3>
      <p v-if="excerpt" class="cu-article-card__excerpt">{{ excerpt }}</p>
      <div class="cu-article-card__meta">
        <span v-if="author" class="cu-article-card__author">{{ author }}</span>
        <time v-if="date" class="cu-article-card__date">{{ date }}</time>
      </div>
      <a v-if="href" class="cu-article-card__read" :href="href" :aria-label="readLabel + ': ' + title">{{ readLabel }}</a>
    </div>
  </article>
</template>

<style scoped src="./styles.css"></style>
