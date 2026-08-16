import './styles.css'

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const classes = ['cu-avatar', 'cu-avatar--' + size, className].filter(Boolean).join(' ')
  if (src) {
    return <img className={classes} src={src} alt={alt || fallback || ''} data-ai-role="avatar" data-ai-intent="identify-user" data-ai-state="image" />
  }
  return <span className={classes} data-ai-role="avatar" data-ai-intent="identify-user" data-ai-state="fallback" aria-label={alt || fallback}>{fallback}</span>
}
