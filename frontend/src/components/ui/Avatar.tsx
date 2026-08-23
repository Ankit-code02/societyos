interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
}

export function Avatar({
  name,
  size = 'md',
}: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className={[
        'flex shrink-0 items-center justify-center rounded-full',
        'bg-[var(--color-teal-100)] font-semibold',
        'text-[var(--color-forest-900)]',
        sizes[size],
      ].join(' ')}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  )
}