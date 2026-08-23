import {
  Bot,
  Home,
  MessageSquareWarning,
  Users,
} from 'lucide-react'

const items = [
  { label: 'Home', icon: Home },
  { label: 'Issues', icon: MessageSquareWarning },
  { label: 'Community', icon: Users },
  { label: 'AI', icon: Bot },
]

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map((item, index) => {
          const Icon = item.icon
          const active = index === 0

          return (
            <button
              key={item.label}
              type="button"
              className={[
                'flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-1.5',
                'text-[10px] font-semibold transition-colors',
                active
                  ? 'text-[var(--color-forest-900)]'
                  : 'text-[var(--color-ink-500)]',
              ].join(' ')}
            >
              <Icon className="h-5 w-5" />

              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}