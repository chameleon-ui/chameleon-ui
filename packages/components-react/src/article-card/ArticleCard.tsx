import './styles.css'

export interface ArticleCardProps {
  title: string
  excerpt?: string
  author?: string
  date?: string
  coverSrc?: string
  coverAlt?: string
  href?: string
  readLabel?: string
  className?: string
}

export function ArticleCard({
  title,
  excerpt,
  author,
  date,
  coverSrc,
  coverAlt = '',
  href,
  readLabel = 'Read article',
  className,
}: ArticleCardProps) {
  const classes = ['cu-article-card', className].filter(Boolean).join(' ')
  return (
    <article className={classes} data-ai-role="article-card" data-ai-intent="group-content" data-ai-state="default">
      {coverSrc ? <img className="cu-article-card__cover" src={coverSrc} alt={coverAlt} loading="lazy" /> : null}
      <div className="cu-article-card__body">
        <h3 className="cu-article-card__title">{title}</h3>
        {excerpt ? <p className="cu-article-card__excerpt">{excerpt}</p> : null}
        <div className="cu-article-card__meta">
          {author ? <span className="cu-article-card__author">{author}</span> : null}
          {date ? <time className="cu-article-card__date">{date}</time> : null}
        </div>
        {href ? (
          <a className="cu-article-card__read" href={href} aria-label={`${readLabel}: ${title}`}>
            {readLabel}
          </a>
        ) : null}
      </div>
    </article>
  )
}
