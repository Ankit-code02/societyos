import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[var(--color-ink-700)]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={[
          'min-h-11 w-full rounded-xl border bg-white px-4',
          'text-sm text-[var(--color-ink-950)]',
          'placeholder:text-[var(--color-ink-300)]',
          'outline-none transition-all duration-200',
          error
            ? 'border-[var(--color-danger)] focus:ring-2 focus:ring-[var(--color-danger-bg)]'
            : 'border-[var(--color-border)] focus:border-[var(--color-teal-500)] focus:ring-2 focus:ring-[var(--color-teal-100)]',
          className,
        ].join(' ')}
        {...props}
      />

      {error && (
        <p className="text-xs font-medium text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  )
}