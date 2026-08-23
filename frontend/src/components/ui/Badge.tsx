import type { ReactNode } from 'react'

type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'accent'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  success:
    'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  warning:
    'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  danger:
    'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
  info:
    'bg-[var(--color-info-bg)] text-[var(--color-info)]',
  neutral:
    'bg-[var(--color-ivory-100)] text-[var(--color-ink-700)]',
  accent:
    'bg-[var(--color-apricot-100)] text-[var(--color-warning)]',
}

export function Badge({
  children,
  variant = 'neutral',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1',
        'text-xs font-semibold',
        variants[variant],
      ].join(' ')}
    >
      {children}
    </span>
  )
}