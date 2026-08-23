import {
  Bot,
  Home,
  MessageSquareWarning,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useSocietyId } from '../../hooks/useSocietyId'

const items = [
  { label: 'Home', path: '/app/dashboard', icon: Home },
  { label: 'Issues', path: '/app/complaints', icon: MessageSquareWarning },
  { label: 'Community', path: '/app/community', icon: Users },
  { label: 'AI', path: '/app/ai-help', icon: Bot },
]

export function MobileNav() {
  const societyId = useSocietyId()

  const withSocietyId = (path: string) => {
    if (!societyId) {
      return path
    }

    return `${path}?societyId=${encodeURIComponent(societyId)}`
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.label}
              to={withSocietyId(item.path)}
              className={({ isActive }) =>
                [
                  'flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-1.5',
                  'text-[10px] font-semibold transition-colors',
                  isActive
                    ? 'text-[var(--color-forest-900)]'
                    : 'text-[var(--color-ink-500)]',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}