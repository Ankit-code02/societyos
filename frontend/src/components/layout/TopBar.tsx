import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import {
  Bell,
  Menu,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Avatar } from '../ui/Avatar'
import { getUnreadNotificationCount } from '../../services/api/notificationApi'

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({
  onMenuClick,
}: TopBarProps) {
    const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let mounted = true

    async function loadUnreadCount() {
      try {
        const count =
          await getUnreadNotificationCount()

        if (mounted) {
          setUnreadCount(count)
        }
      } catch {
        // Notification count should not prevent
        // the rest of the application from loading.
      }
    }

    void loadUnreadCount()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center border-b border-[var(--color-border)] bg-[var(--color-ivory-100)]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="mr-3 rounded-xl p-2 text-[var(--color-ink-700)] hover:bg-white lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden max-w-sm flex-1 sm:block">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5">
          <Search className="h-4 w-4 text-[var(--color-ink-300)]" />

          <input
            type="search"
            placeholder="Search your society..."
            className="w-full bg-transparent text-sm text-[var(--color-ink-950)] outline-none placeholder:text-[var(--color-ink-300)]"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <Link
          to="/app/notifications"
          className="relative rounded-xl p-2.5 text-[var(--color-ink-700)] transition-colors hover:bg-white"
          aria-label={
            unreadCount > 0
              ? `${unreadCount} unread notifications`
              : 'Notifications'
          }
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <>
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--color-apricot-500)] ring-2 ring-[var(--color-ivory-100)]" />

              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-teal-600)] px-1 text-[10px] font-bold text-white">
                {unreadCount > 99
                  ? '99+'
                  : unreadCount}
              </span>
            </>
          )}
        </Link>

        <div className="hidden h-8 w-px bg-[var(--color-border)] sm:block" />

        <button
          type="button"
          className="flex items-center gap-3 rounded-xl p-1.5 pr-2 transition-colors hover:bg-white"
        >
          <Avatar
            name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
            size="sm"
          />

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-[var(--color-ink-950)]">
              Ankit
            </p>

            <p className="text-[11px] text-[var(--color-ink-500)]">
              Resident
            </p>
          </div>
        </button>
      </div>
    </header>
  )
}