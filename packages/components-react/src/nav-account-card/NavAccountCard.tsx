import { Avatar } from '../avatar/Avatar.js'
import { Button } from '../button/Button.js'
import './styles.css'

export interface NavAccountCardProps {
  /** Display name (primary line). */
  username: string
  /** Optional secondary line (nickname). */
  nickname?: string
  avatarSrc?: string
  avatarFallback?: string
  /** Logout control label. Default "Log out". */
  logoutLabel?: string
  onLogout?: () => void
  className?: string
}

const logoutIcon = (
  <svg viewBox="0 0 24 24" className="cu-nav-account-card__logout-svg" aria-hidden="true">
    <path
      d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M16 8l4 4-4 4M20 12H10"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
)

/**
 * Official Navigation sidebar foot: avatar | username/nickname | logout.
 * Mount in Navigation `footer` / `#footer` — sidebar-only (compact TabBar hides it).
 */
export function NavAccountCard({
  username,
  nickname,
  avatarSrc,
  avatarFallback,
  logoutLabel = 'Log out',
  onLogout,
  className,
}: NavAccountCardProps) {
  const classes = ['cu-nav-account-card', className].filter(Boolean).join(' ')
  const fallback = avatarFallback ?? Array.from(username.trim())[0]?.toUpperCase() ?? '?'

  return (
    <div
      className={classes}
      data-ai-role="nav-account-card"
      data-ai-intent="identify-user"
      data-ai-state="default"
    >
      <Avatar
        className="cu-nav-account-card__avatar"
        src={avatarSrc}
        alt={username}
        fallback={fallback}
        size="sm"
      />
      <div className="cu-nav-account-card__text">
        <span className="cu-nav-account-card__username">{username}</span>
        {nickname ? <span className="cu-nav-account-card__nickname">{nickname}</span> : null}
      </div>
      <Button
        className="cu-nav-account-card__logout"
        type="button"
        variant="ghost"
        size="sm"
        icon={logoutIcon}
        onClick={onLogout}
        aria-label={logoutLabel}
      >
        <span className="cu-nav-account-card__logout-label">{logoutLabel}</span>
      </Button>
    </div>
  )
}
