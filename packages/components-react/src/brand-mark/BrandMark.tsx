import type { ImgHTMLAttributes } from 'react'
import './styles.css'

export type BrandMarkSize = 'sm' | 'md'

export interface BrandMarkProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  src: string
  alt: string
  size?: BrandMarkSize
  className?: string
}

export function BrandMark({ src, alt, size = 'md', className, ...rest }: BrandMarkProps) {
  const classes = ['cu-brand-mark', `cu-brand-mark--${size}`, className].filter(Boolean).join(' ')
  return (
    <img
      {...rest}
      className={classes}
      src={src}
      alt={alt}
      data-ai-role="brand-mark"
      data-ai-intent="show-brand"
      data-ai-state={size}
    />
  )
}
