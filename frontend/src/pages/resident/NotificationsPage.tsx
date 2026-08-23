import { useEffect, useState } from 'react'
import {
  Bell,
  CheckCheck,
  Loader2,
} from 'lucide-react'

import {
  getNotifications,
  markNotificationAsRead,
  type Notification,
} from '../../services/api/notificationApi'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadNotifications() {
    setLoading(true)
    setError('')

    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load notifications.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  async function handleMarkAsRead(
    notification: Notification,
  ) {
    if (notification.read) {
      return
    }

    try {
      await markNotificationAsRead(notification.id)

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                read: true,
                readAt: new Date().toISOString(),
              }
            : item,
        ),
      )
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to mark notification as read.',
      )
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
            Activity
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--color-ink-950)]">
            Notifications
          </h1>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            Stay updated with activity in your society.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-[var(--color-ivory-100)] px-3 py-2 text-sm font-semibold text-[var(--color-ink-700)]">
          <Bell className="h-4 w-4" />
          {unreadCount} unread
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-10 flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-teal-600)]" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-white px-6 py-16 text-center">
          <Bell className="mx-auto h-10 w-10 text-[var(--color-ink-300)]" />

          <h2 className="mt-4 text-lg font-semibold text-[var(--color-ink-900)]">
            You're all caught up
          </h2>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            New society activity will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-2xl border bg-white p-5 transition ${
                notification.read
                  ? 'border-[var(--color-border)]'
                  : 'border-[var(--color-teal-200)] bg-[var(--color-teal-50)]/30'
              }`}
            >
              <div className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-ivory-100)]">
                  <Bell className="h-5 w-5 text-[var(--color-teal-600)]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row">
                    <div>
                      <h2 className="font-semibold text-[var(--color-ink-900)]">
                        {notification.title}
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-[var(--color-ink-600)]">
                        {notification.message}
                      </p>
                    </div>

                    {!notification.read && (
                      <span className="h-fit shrink-0 rounded-full bg-[var(--color-teal-600)] px-2.5 py-1 text-xs font-semibold text-white">
                        New
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xs text-[var(--color-ink-400)]">
                      {new Date(
                        notification.createdAt,
                      ).toLocaleString()}
                    </p>

                    {!notification.read && (
                      <button
                        type="button"
                        onClick={() =>
                          handleMarkAsRead(notification)
                        }
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-teal-600)] hover:text-[var(--color-forest-900)]"
                      >
                        <CheckCheck className="h-4 w-4" />
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}