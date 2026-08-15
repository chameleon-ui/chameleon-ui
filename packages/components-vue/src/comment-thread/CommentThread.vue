<script lang="ts">
export type { CommentItem, CommentThreadProps } from './types.js'
</script>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { CommentNode } from './CommentNode.js'
import type { CommentThreadProps } from './types.js'

const props = withDefaults(defineProps<CommentThreadProps>(), { label: 'Comments', replyLabel: 'Reply' })
const emit = defineEmits<{ reply: [commentId: string] }>()
const instance = getCurrentInstance()
const canReply = computed(() => typeof instance?.vnode.props?.onReply === 'function')
const classes = computed(() => ['cu-comment-thread', props.class].filter(Boolean).join(' '))
</script>

<template>
  <section :class="classes" :aria-label="label" data-ai-role="comment-thread" data-ai-intent="enumerate-items" :data-ai-state="comments.length === 0 ? 'empty' : 'default'">
    <ul class="cu-comment-thread__list">
      <CommentNode v-for="comment in comments" :key="comment.id" :comment="comment" :reply-label="replyLabel" :can-reply="canReply" @reply="emit('reply', $event)" />
    </ul>
  </section>
</template>

<style scoped src="./styles.css"></style>
