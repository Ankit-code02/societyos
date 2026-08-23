import {
  Bell,
  Bot,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Home,
  MessageSquareWarning,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useSocietyId } from '../../hooks/useSocietyId'
import { useAuth } from '../auth/AuthProvider'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navigation = [
  { label: 'Home', path: '/app/dashboard', icon: Home },
  { label: 'Complaints', path: '/app/complaints', icon: MessageSquareWarning },
  { label: 'Community', path: '/app/community', icon: Bell },
  { label: 'Meetings', path: '/app/meetings', icon: CalendarDays },
  { label: 'Payments', path: '/app/payments', icon: CircleDollarSign },
  { label: 'AI Help', path: '/app/ai-help', icon: Bot },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const societyId = useSocietyId()
  const { user } = useAuth()

  const withSocietyId = (path: string) => {
    if (!societyId) {
      return path
    }

    return `${path}?societyId=${encodeURIComponent(societyId)}`
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col',
          'border-r border-[var(--color-border)] bg-[var(--color-surface)]',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:static lg:z-auto lg:translate-x-0',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between px-6">
          <NavLink
            to={withSocietyId('/app/dashboard')}
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-forest-900)] font-bold text-white">
              S
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight text-[var(--color-ink-950)]">
                SocietyOS
              </p>

              <p className="text-[11px] text-[var(--color-ink-500)]">
                Community platform
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--color-ink-500)] hover:bg-[var(--color-ivory-100)] lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main navigation */}
        <div className="px-4 pt-5">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-300)]">
            Your space
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={withSocietyId(item.path)}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      'group flex w-full items-center gap-3 rounded-xl px-3 py-3',
                      'text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-[var(--color-forest-900)] text-white shadow-sm'
                        : 'text-[var(--color-ink-700)] hover:bg-[var(--color-ivory-100)]',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="h-[18px] w-[18px]" />

                      <span className="flex-1 text-left">
                        {item.label}
                      </span>

                      {isActive && (
                        <ChevronRight className="h-4 w-4 opacity-60" />
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Society */}
        <div className="mt-8 px-4">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-300)]">
            Society
          </p>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-ivory-50)] p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-teal-100)] text-[var(--color-forest-900)]">
                <Building2 className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--color-ink-950)]">
                  {user?.societyName ?? 'Your Society'}
                </p>

                <p className="text-xs text-[var(--color-ink-500)]">
                  {user?.unitId ? `Unit ${user.unitId}` : 'Society member'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--color-ink-500)]">
              <Users className="h-3.5 w-3.5" />
              <span>
                {user?.role === 'SOCIETY_ADMIN' ? 'Society Admin' : 'Resident'}
              </span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="mt-auto border-t border-[var(--color-border)] p-4">
          <NavLink
            to={withSocietyId('/app/settings')}
            onClick={onClose}
            className={({ isActive }) =>
              [
                'flex w-full items-center gap-3 rounded-xl px-3 py-3',
                'text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--color-ivory-100)] text-[var(--color-forest-900)]'
                  : 'text-[var(--color-ink-700)] hover:bg-[var(--color-ivory-100)]',
              ].join(' ')
            }
          >
            <Settings className="h-[18px] w-[18px]" />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  )
}