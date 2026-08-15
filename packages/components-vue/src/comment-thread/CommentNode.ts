import { defineComponent, h, type PropType, type VNode } from 'vue'
import type { CommentItem } from './types.js'

export const CommentNode = defineComponent({
  name: 'CommentNode',
  props: {
    comment: { type: Object as PropType<CommentItem>, required: true },
    replyLabel: { type: String, required: true },
    canReply: { type: Boolean, required: true },
  },
  emits: ['reply'],
  setup(props, { emit }): () => VNode {
    return (): VNode =>
      h('li', { class: 'cu-comment-thread__item' }, [
        h('div', { class: 'cu-comment-thread__comment' }, [
          h('div', { class: 'cu-comment-thread__meta' }, [
            h('span', { class: 'cu-comment-thread__author' }, props.comment.author),
            h('time', { class: 'cu-comment-thread__time' }, props.comment.time),
          ]),
          h('p', { class: 'cu-comment-thread__text' }, props.comment.text),
          props.canReply
            ? h(
                'button',
                {
                  type: 'button',
                  class: 'cu-comment-thread__reply',
                  'aria-label': `${props.replyLabel}: ${props.comment.author}`,
                  onClick: () => emit('reply', props.comment.id),
                },
                props.replyLabel,
              )
            : null,
        ]),
        props.comment.replies?.length
          ? h(
              'ul',
              { class: 'cu-comment-thread__list' },
              props.comment.replies.map((reply) =>
                h(CommentNode, {
                  key: reply.id,
                  comment: reply,
                  replyLabel: props.replyLabel,
                  canReply: props.canReply,
                  onReply: (id: string) => emit('reply', id),
                }),
              ),
            )
          : null,
      ])
  },
})
