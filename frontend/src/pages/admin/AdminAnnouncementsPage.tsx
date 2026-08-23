import { useEffect, useState } from 'react'
import {
  Loader2,
  Megaphone,
  Plus,
  RefreshCw,
  Send,
  X,
} from 'lucide-react'

import {
  createAnnouncement,
  getAllAnnouncements,
  publishAnnouncement,
} from '../../services/api/announcementsApi'

import type { AnnouncementResponse } from '../../types/announcement'
import { useSocietyId } from '../../hooks/useSocietyId'

export default function AdminAnnouncementsPage() {
  const societyId = useSocietyId()

  const [announcements, setAnnouncements] = useState<
    AnnouncementResponse[]
  >([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('GENERAL')

  async function loadAnnouncements(showRefresh = false) {
    if (!societyId) {
      return
    }
    try {
      setError('')

      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const data = await getAllAnnouncements(societyId)

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
    loadAnnouncements()
  }, [societyId])

  async function handleCreate(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    if (!societyId) {
      return
    }

    try {
      setSaving(true)
      setError('')

      const created = await createAnnouncement(
        societyId,
        {
          title: title.trim(),
          content: content.trim(),
          category: category.trim(),
        },
      )

      setAnnouncements((current) => [
        created,
        ...current,
      ])

      setTitle('')
      setContent('')
      setCategory('GENERAL')
      setShowForm(false)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to create announcement.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish(
    announcementId: string,
  ) {
    const confirmed = window.confirm(
      'Publish this announcement to residents?',
    )
    if (!societyId) {
      return
    }
    if (!confirmed) {
      return
    }

    try {
      setError('')

      const updated = await publishAnnouncement(
        societyId,
        announcementId,
      )

      setAnnouncements((current) =>
        current.map((announcement) =>
          announcement.id === updated.id
            ? updated
            : announcement,
        ),
      )
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to publish announcement.',
      )
    }
  }
  if (!societyId) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-800">
            Society not selected
          </h1>

          <p className="mt-2 text-sm text-red-700">
            Please return to your account and select a society.
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-teal-600)] text-white">
            <Megaphone className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[var(--color-ink-950)]">
              Announcements
            </h1>

            <p className="mt-2 text-sm text-[var(--color-ink-500)]">
              Create and publish important society updates.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => loadAnnouncements(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink-700)] disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? 'animate-spin' : ''
              }`}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              setShowForm((current) => !current)
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-600)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            {showForm ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}

            {showForm ? 'Close' : 'New announcement'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-6"
        >
          <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">
            Create announcement
          </h2>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="text-sm font-semibold">
                Title
              </label>

              <input
                required
                maxLength={200}
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Water supply maintenance"
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Category
              </label>

              <input
                required
                maxLength={30}
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                placeholder="GENERAL"
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm uppercase outline-none focus:border-[var(--color-teal-600)]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Content
              </label>

              <textarea
                required
                rows={6}
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Write the announcement..."
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)]"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-600)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              Create announcement
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-teal-600)]" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] bg-white px-6 py-16 text-center">
          <Megaphone className="mx-auto h-10 w-10 text-[var(--color-ink-300)]" />

          <h2 className="mt-4 text-lg font-semibold">
            No announcements yet
          </h2>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            Create an announcement to communicate with residents.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {announcements.map((announcement) => {
            const published =
              announcement.status === 'PUBLISHED'

            return (
              <article
                key={announcement.id}
                className="rounded-2xl border border-[var(--color-border)] bg-white p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--color-ivory-100)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-700)]">
                        {announcement.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          published
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {announcement.status}
                      </span>
                    </div>

                    <h2 className="mt-3 text-lg font-semibold text-[var(--color-ink-950)]">
                      {announcement.title}
                    </h2>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--color-ink-600)]">
                      {announcement.content}
                    </p>

                    <div className="mt-4 text-xs text-[var(--color-ink-400)]">
                      Created{' '}
                      {new Date(
                        announcement.createdAt,
                      ).toLocaleString()}
                    </div>
                  </div>

                  {!published && (
                    <button
                      type="button"
                      onClick={() =>
                        handlePublish(announcement.id)
                      }
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--color-teal-600)] px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <Send className="h-4 w-4" />
                      Publish
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}