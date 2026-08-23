import { useQuery } from '@tanstack/react-query'
import {
  CalendarDays,
  Clock3,
  MapPin,
  RefreshCw,
  Video,
} from 'lucide-react'

import { getMeetings } from '../../services/api/meetingsApi'
import type { MeetingResponse } from '../../types/meeting'
import { Link } from 'react-router-dom'
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

function MeetingCard({
  meeting,
  featured = false,
}: {
  meeting: MeetingResponse
  featured?: boolean
}) {
  const date = new Date(meeting.scheduledAt)

  return (
    <article
      className={`rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        featured ? 'lg:p-8' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            meeting.status === 'CANCELLED'
              ? 'bg-red-50 text-red-600'
              : 'bg-[var(--color-teal-50)] text-[var(--color-teal-600)]'
          }`}
        >
          <CalendarDays className="h-5 w-5" />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
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

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-teal-600)]">
          {date.toLocaleDateString('en-IN', {
            weekday: 'long',
          })}
        </p>

        <h2
          className={`mt-2 font-semibold tracking-[-0.03em] text-[var(--color-ink-950)] ${
            featured ? 'text-2xl' : 'text-lg'
          }`}
        >
          {meeting.title}
        </h2>

        {meeting.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-ink-500)]">
            {meeting.description}
          </p>
        )}
      </div>

      <div className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-5">
        <div className="flex items-center gap-3 text-sm text-[var(--color-ink-600)]">
          <Clock3 className="h-4 w-4 text-[var(--color-ink-400)]" />
          <span>
            {formatDate(meeting.scheduledAt)} ·{' '}
            {formatTime(meeting.scheduledAt)}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-[var(--color-ink-600)]">
          <MapPin className="h-4 w-4 text-[var(--color-ink-400)]" />
          <span>{meeting.venue}</span>
        </div>
      </div>
    </article>
  )
}

export default function MeetingsPage() {
  const societyId = useSocietyId()

  const {
    data: meetings = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['society-meetings', societyId],
    queryFn: () => {
      if (!societyId) {
        throw new Error('Society ID is required')
      }

      return getMeetings(societyId)
    },
    enabled: Boolean(societyId),
  })
  if (!societyId) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-800">
          Society not selected
        </h1>

        <p className="mt-2 text-sm text-red-700">
          Please return to your account and select a society.
        </p>

        <Link
          to="/account"
          className="mt-5 inline-flex rounded-lg bg-[var(--color-forest-900)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Go to My Account
        </Link>
      </div>
    )
  }

  const upcomingMeetings = meetings
    .filter(
      (meeting) =>
        meeting.status === 'SCHEDULED' &&
        new Date(meeting.scheduledAt).getTime() > Date.now(),
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() -
        new Date(b.scheduledAt).getTime(),
    )

  const nextMeeting = upcomingMeetings[0]

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-600)]">
            Community
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink-950)] sm:text-4xl">
            Society meetings
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-ink-500)]">
            Stay informed about meetings, discussions, and important
            community decisions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink-700)] transition hover:bg-[var(--color-ivory-100)] disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-3xl border border-[var(--color-border)] bg-white"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-800">
            We couldn't load meetings.
          </p>

          <p className="mt-1 text-sm text-red-700">
            Please check your connection and try again.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Next meeting */}
          {nextMeeting && (
            <section>
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-400)]">
                  Up next
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
                <MeetingCard
                  meeting={nextMeeting}
                  featured
                />

                <div className="rounded-3xl bg-[var(--color-forest-900)] p-7 text-white">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <Video className="h-5 w-5" />
                  </div>

                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                    Upcoming
                  </p>

                  <p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                    {upcomingMeetings.length}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/70">
                    scheduled meeting
                    {upcomingMeetings.length === 1 ? '' : 's'} coming up
                    for your community.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Empty upcoming state */}
          {!nextMeeting && (
            <section className="rounded-3xl border border-dashed border-[var(--color-border)] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
                <CalendarDays className="h-7 w-7" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-[var(--color-ink-950)]">
                No upcoming meetings
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-ink-500)]">
                There aren't any scheduled society meetings right now.
              </p>
            </section>
          )}

          {/* All meetings */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">
                All meetings
              </h2>

              <p className="mt-1 text-xs text-[var(--color-ink-400)]">
                {meetings.length} meeting
                {meetings.length === 1 ? '' : 's'} in total
              </p>
            </div>

            {meetings.length === 0 ? (
              <div className="rounded-3xl border border-[var(--color-border)] bg-white p-10 text-center">
                <p className="text-sm text-[var(--color-ink-500)]">
                  No meeting history is available yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {meetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}