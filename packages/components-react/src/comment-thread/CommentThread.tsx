import './styles.css'

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
  onReply?: (commentId: string) => void
  className?: string
}

export function CommentThread({ comments, label = 'Comments', replyLabel = 'Reply', onReply, className }: CommentThreadProps) {
  const classes = ['cu-comment-thread', className].filter(Boolean).join(' ')

  const renderComments = (items: CommentItem[]) => (
    <ul className="cu-comment-thread__list">
      {items.map((comment) => (
        <li key={comment.id} className="cu-comment-thread__item">
          <div className="cu-comment-thread__comment">
            <div className="cu-comment-thread__meta">
              <span className="cu-comment-thread__author">{comment.author}</span>
              <time className="cu-comment-thread__time">{comment.time}</time>
            </div>
            <p className="cu-comment-thread__text">{comment.text}</p>
            {onReply ? (
              <button
                type="button"
                className="cu-comment-thread__reply"
                aria-label={`${replyLabel}: ${comment.author}`}
                onClick={() => onReply(comment.id)}
              >
                {replyLabel}
              </button>
            ) : null}
          </div>
          {comment.replies && comment.replies.length > 0 ? renderComments(comment.replies) : null}
        </li>
      ))}
    </ul>
  )

  return (
    <section
      className={classes}
      aria-label={label}
      data-ai-role="comment-thread" data-ai-intent="enumerate-items"
      data-ai-state={comments.length === 0 ? 'empty' : 'default'}
    >
      {renderComments(comments)}
    </section>
  )
}
