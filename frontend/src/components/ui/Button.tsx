import type { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'accent'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-forest-900)] text-white hover:bg-[var(--color-forest-800)]',
  secondary:
    'border border-[var(--color-border)] bg-white text-[var(--color-ink-950)] hover:bg-[var(--color-ivory-50)]',
  ghost:
    'bg-transparent text-[var(--color-ink-700)] hover:bg-[var(--color-ivory-100)]',
  danger:
    'bg-[var(--color-danger)] text-white hover:opacity-90',
  accent:
    'bg-[var(--color-apricot-500)] text-[var(--color-forest-950)] hover:brightness-95',
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5',
        'text-sm font-semibold transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-500)] focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'active:scale-[0.98]',
        variants[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}