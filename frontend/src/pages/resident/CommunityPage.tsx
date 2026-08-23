import { useQuery } from '@tanstack/react-query'
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Info,
  Megaphone,
  RefreshCw,
} from 'lucide-react'
import { getPublishedAnnouncements } from '../../services/api/announcementsApi'
import type { AnnouncementResponse } from '../../types/announcement'
import { Link } from 'react-router-dom'
import { useSocietyId } from '../../hooks/useSocietyId'

function formatDate(date?: string) {
  if (!date) return 'Not published'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function getCategoryLabel(category: string) {
  return category
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function CategoryIcon({ category }: { category: string }) {
  const normalized = category.toLowerCase()

  if (
    normalized.includes('event') ||
    normalized.includes('meeting')
  ) {
    return <CalendarDays className="h-5 w-5" />
  }

  if (
    normalized.includes('important') ||
    normalized.includes('urgent')
  ) {
    return <Bell className="h-5 w-5" />
  }

  if (normalized.includes('info')) {
    return <Info className="h-5 w-5" />
  }

  return <Megaphone className="h-5 w-5" />
}

function AnnouncementCard({
  announcement,
  featured = false,
}: {
  announcement: AnnouncementResponse
  featured?: boolean
}) {
  return (
    <article
      className={`rounded-3xl border border-[var(--color-border)] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        featured ? 'p-7 lg:p-8' : 'p-5'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
          <CategoryIcon category={announcement.category} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--color-ivory-100)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-500)]">
              {getCategoryLabel(announcement.category)}
            </span>

            <span className="text-xs text-[var(--color-ink-400)]">
              {formatDate(announcement.publishedAt)}
            </span>
          </div>

          <h2
            className={`mt-3 font-semibold tracking-[-0.03em] text-[var(--color-ink-950)] ${
              featured ? 'text-2xl' : 'text-base'
            }`}
          >
            {announcement.title}
          </h2>

          <p
            className={`mt-2 whitespace-pre-line text-sm leading-6 text-[var(--color-ink-500)] ${
              featured ? '' : 'line-clamp-3'
            }`}
          >
            {announcement.content}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
            <p className="text-xs text-[var(--color-ink-400)]">
              Published by {announcement.createdByEmail}
            </p>

            <ChevronRight className="h-4 w-4 text-[var(--color-ink-300)]" />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function CommunityPage() {
  const societyId = useSocietyId()

  const {
    data: announcements = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
        queryKey: ['published-announcements', societyId],
        queryFn: () => {
          if (!societyId) {
            throw new Error('Society ID is required')
          }

          return getPublishedAnnouncements(societyId)
        },
        enabled: Boolean(societyId),
      })

  const sortedAnnouncements = [...announcements].sort(
    (a, b) =>
      new Date(
        b.publishedAt ?? b.createdAt,
      ).getTime() -
      new Date(
        a.publishedAt ?? a.createdAt,
      ).getTime(),
  )

  const featuredAnnouncement = sortedAnnouncements[0]
  const remainingAnnouncements = sortedAnnouncements.slice(1)

  const categoryCount = new Set(
    announcements.map((announcement) => announcement.category),
  ).size
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
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-600)]">
            Community
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink-950)] sm:text-4xl">
            Stay connected
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-ink-500)]">
            Keep up with announcements and important updates from
            your society.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink-700)] transition hover:bg-[var(--color-ivory-100)] disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isFetching ? 'animate-spin' : ''
            }`}
          />
          Refresh
        </button>
      </section>

      {/* Loading */}
      {isLoading && (
        <>
          <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="h-80 animate-pulse rounded-3xl bg-white" />
            <div className="h-80 animate-pulse rounded-3xl bg-white" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        </>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <Bell className="h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="font-semibold text-red-800">
                We couldn't load community announcements.
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
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Overview */}
          <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            {featuredAnnouncement ? (
              <AnnouncementCard
                announcement={featuredAnnouncement}
                featured
              />
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
                    <Megaphone className="h-7 w-7" />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-[var(--color-ink-950)]">
                    No announcements yet
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-ink-500)]">
                    There are no published announcements from your
                    society right now.
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-3xl bg-[var(--color-forest-900)] p-7 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <Megaphone className="h-5 w-5" />
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                Community updates
              </p>

              <p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                {announcements.length}
              </p>

              <p className="mt-2 text-sm leading-6 text-white/70">
                published announcement
                {announcements.length === 1 ? '' : 's'} available
                for your community.
              </p>

              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="text-xs text-white/50">
                  Categories
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {categoryCount}
                </p>
              </div>
            </div>
          </section>

          {/* Recent */}
          {remainingAnnouncements.length > 0 && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">
                  Recent announcements
                </h2>

                <p className="mt-1 text-xs text-[var(--color-ink-400)]">
                  Latest updates shared by your society
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {remainingAnnouncements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty history */}
          {announcements.length === 0 && (
            <section className="rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center">
              <p className="text-sm text-[var(--color-ink-500)]">
                Check back here when your society publishes a new
                announcement.
              </p>
            </section>
          )}
        </>
      )}
    </div>
  )
}