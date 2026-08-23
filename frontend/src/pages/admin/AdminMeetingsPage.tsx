import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  CalendarDays,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react'

import {
  cancelMeeting,
  createMeeting,
  getMeetings,
} from '../../services/api/meetingsApi'

import type { MeetingResponse } from '../../types/meeting'
import { useSocietyId } from '../../hooks/useSocietyId'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}
function getMinimumDateTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export default function AdminMeetingsPage() {
    const societyId = useSocietyId()

  const [meetings, setMeetings] = useState<MeetingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [venue, setVenue] = useState('')

  async function loadMeetings(showRefresh = false) {
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

      const data = await getMeetings(societyId)

      setMeetings(data)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load meetings.',
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadMeetings()
  }, [societyId])

  async function handleCreateMeeting(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    if (!societyId) {
      return
    }
    try {
      setSaving(true)
      setError('')

      const created = await createMeeting(
        societyId,
        {
          title: title.trim(),
          description: description.trim() || undefined,
          scheduledAt: new Date(scheduledAt).toISOString(),
          venue: venue.trim(),
        },
      )

      setMeetings((current) => [
        created,
        ...current,
      ])

      setTitle('')
      setDescription('')
      setScheduledAt('')
      setVenue('')
      setShowForm(false)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to create meeting.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleCancel(meetingId: string) {
      if (!societyId) {
        return
      }
    const confirmed = window.confirm(
      'Are you sure you want to cancel this meeting?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      const updated = await cancelMeeting(
        societyId,
        meetingId,
      )

      setMeetings((current) =>
        current.map((meeting) =>
          meeting.id === updated.id
            ? updated
            : meeting,
        ),
      )
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to cancel meeting.',
      )
    }
  }

  const upcomingMeetings = meetings.filter(
    (meeting) =>
      meeting.status === 'SCHEDULED' &&
      new Date(meeting.scheduledAt).getTime() >
        Date.now(),
  )
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
            <CalendarDays className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[var(--color-ink-950)]">
              Meetings
            </h1>

            <p className="mt-2 text-sm text-[var(--color-ink-500)]">
              Schedule and manage society meetings.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => loadMeetings(true)}
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
            onClick={() => setShowForm((current) => !current)}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-600)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            {showForm ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {showForm ? 'Close' : 'New meeting'}
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
          onSubmit={handleCreateMeeting}
          className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-6"
        >
          <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">
            Schedule meeting
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
                placeholder="Monthly society meeting"
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Description
              </label>

              <textarea
                maxLength={5000}
                rows={4}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Topics and agenda..."
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)]"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">
                  Date & time
                </label>

                <input
                  required
                  type="datetime-local"
                  min={getMinimumDateTime()}
                  value={scheduledAt}
                  onChange={(event) =>
                    setScheduledAt(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Venue
                </label>

                <input
                  required
                  maxLength={200}
                  value={venue}
                  onChange={(event) =>
                    setVenue(event.target.value)
                  }
                  placeholder="Society clubhouse"
                  className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)]"
                />
              </div>
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
              Schedule meeting
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-sm text-[var(--color-ink-500)]">
            Upcoming meetings
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {upcomingMeetings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-sm text-[var(--color-ink-500)]">
            Total meetings
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {meetings.length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-teal-600)]" />
        </div>
      ) : meetings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] bg-white px-6 py-16 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-[var(--color-ink-300)]" />

          <h2 className="mt-4 text-lg font-semibold">
            No meetings yet
          </h2>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            Schedule your first society meeting.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {meetings.map((meeting) => (
            <article
              key={meeting.id}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        meeting.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {meeting.status === 'CANCELLED'
                        ? 'Cancelled'
                        : 'Scheduled'}
                    </span>
                  </div>

                  <h2 className="mt-3 text-lg font-semibold text-[var(--color-ink-950)]">
                    {meeting.title}
                  </h2>

                  {meeting.description && (
                    <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                      {meeting.description}
                    </p>
                  )}

                  <div className="mt-5 grid gap-3 text-sm text-[var(--color-ink-600)] sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[var(--color-ink-400)]" />
                      {formatDate(meeting.scheduledAt)}
                    </div>

                    <div>
                      {formatTime(meeting.scheduledAt)}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[var(--color-ink-400)]" />
                      {meeting.venue}
                    </div>
                  </div>
                </div>

                {meeting.status === 'SCHEDULED' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCancel(meeting.id)
                    }
                    className="inline-flex shrink-0 items-center justify-center rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    Cancel meeting
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}