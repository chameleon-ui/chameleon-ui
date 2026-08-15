export interface CommentItem {
  id: string
  author: string
  time: string
  text: string
  replies?: CommentItem[]
}

export interface CommentThreadProps {
  comments: CommentItem[]
  label?: string
  replyLabel?: string
  class?: string
}
