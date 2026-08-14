import { createElement, type ReactNode } from 'react'

export default function Link({
  to,
  children,
  ...props
}: {
  to: string
  children?: ReactNode
  className?: string
}) {
  return createElement('a', { href: to, ...props }, children)
}
