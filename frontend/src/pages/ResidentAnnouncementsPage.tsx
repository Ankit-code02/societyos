import { useEffect, useState } from 'react'
import {
  Bell,
  Loader2,
  Megaphone,
  RefreshCw,
} from 'lucide-react'

import { getPublishedAnnouncements } from '../services/api/announcementsApi'
import type { AnnouncementResponse } from '../types/announcement'
import { useAuth } from '../components/auth/AuthProvider'

export default function ResidentAnnouncementsPage() {
  const { user } = useAuth()

  const [announcements, setAnnouncements] = useState<
    AnnouncementResponse[]
  >([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const societyId = user?.societyId

  async function loadAnnouncements(
    showRefresh = false,
  ) {
    if (!societyId) {
      setLoading(false)
      return
    }

    try {
      setError('')

      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const data =
        await getPublishedAnnouncements(societyId)

      setAnnouncements(data)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load announcements.',
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void loadAnnouncements()
  }, [societyId])

  if (!societyId) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center">
          <Megaphone className="mx-auto h-10 w-10 text-[var(--color-ink-300)]" />

          <h1 className="mt-4 text-lg font-semibold text-[var(--color-ink-900)]">
            No society found
          </h1>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            Your account is not currently connected to a society.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-teal-600)] text-white">
            <Megaphone className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
              Community
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[var(--color-ink-950)]">
              Announcements
            </h1>

            <p className="mt-2 text-sm text-[var(--color-ink-500)]">
              Stay updated with important news from your society.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void loadAnnouncements(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink-700)] transition hover:bg-[var(--color-ivory-100)] disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing ? 'animate-spin' : ''
            }`}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-[var(--color-teal-600)]" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] bg-white px-6 py-16 text-center">
          <Bell className="mx-auto h-10 w-10 text-[var(--color-ink-300)]" />

          <h2 className="mt-4 text-lg font-semibold text-[var(--color-ink-900)]">
            No announcements yet
          </h2>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            Your society has not published any announcements yet.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-ivory-100)]">
                  <Megaphone className="h-5 w-5 text-[var(--color-teal-600)]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--color-ivory-100)] px-3 py-1 text-xs font-semibold uppercase text-[var(--color-ink-700)]">
                      {announcement.category}
                    </span>

                    <span className="text-xs text-[var(--color-ink-400)]">
                      {new Date(
                        announcement.publishedAt ||
                          announcement.createdAt,
                      ).toLocaleString()}
                    </span>
                  </div>

                  <h2 className="mt-3 text-xl font-semibold text-[var(--color-ink-950)]">
                    {announcement.title}
                  </h2>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--color-ink-600)]">
                    {announcement.content}
                  </p>

                  <div className="mt-5 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-ink-400)]">
                    Published by {announcement.createdByEmail}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}