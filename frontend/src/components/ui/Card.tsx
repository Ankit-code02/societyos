import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export function Card({
  interactive = false,
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'rounded-2xl border border-[var(--color-border)]',
        'bg-[var(--color-surface)] shadow-[0_4px_20px_rgba(18,60,50,0.04)]',
        interactive &&
          'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(18,60,50,0.08)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}