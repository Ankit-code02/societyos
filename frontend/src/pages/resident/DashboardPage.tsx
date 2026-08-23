import {
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../components/auth/AuthProvider'
import { useSocietyId } from '../../hooks/useSocietyId'

import { getMyComplaints } from '../../services/api/complaintsApi'
import { getUpcomingMeetings } from '../../services/api/meetingsApi'
import { getUnitMaintenanceDues } from '../../services/api/maintenanceApi'
import { getUnreadNotificationCount } from '../../services/api/notificationApi'
import { getPublishedAnnouncements } from '../../services/api/announcementsApi'

const actions = [
  {
    title: 'Raise a complaint',
    description: 'Report a maintenance or society issue.',
    icon: Wrench,
    path: 'complaints/new',
  },
  {
    title: 'Pay maintenance',
    description: 'View your current maintenance dues.',
    icon: CreditCard,
    path: 'payments',
  },
  {
    title: 'Ask SocietyOS AI',
    description: 'Get help with common society questions.',
    icon: Sparkles,
    path: 'ai-help',
  },
  {
    title: 'View meetings',
    description: 'See upcoming society meetings.',
    icon: CalendarDays,
    path: 'meetings',
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const societyId = useSocietyId()
  const { user } = useAuth()

  const [complaintCount, setComplaintCount] = useState(0)
  const [upcomingMeetingCount, setUpcomingMeetingCount] = useState(0)
  const [maintenanceDueCount, setMaintenanceDueCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [announcements, setAnnouncements] = useState<
    Awaited<ReturnType<typeof getPublishedAnnouncements>>
  >([])

  useEffect(() => {
    if (!societyId) {
      setLoading(false)
      return
    }

    const selectedSocietyId = societyId

    async function loadDashboard() {
      setLoading(true)

      try {
        const [
          complaints,
          meetings,
          notifications,
          publishedAnnouncements,
        ] = await Promise.all([
          getMyComplaints(selectedSocietyId),
          getUpcomingMeetings(selectedSocietyId),
          getUnreadNotificationCount(),
          getPublishedAnnouncements(selectedSocietyId),
        ])

        setComplaintCount(
          complaints.filter(
            (complaint) =>
              complaint.status !== 'RESOLVED' &&
              complaint.status !== 'CLOSED',
          ).length,
        )

        setUpcomingMeetingCount(meetings.length)

        setNotificationCount(notifications)

        setAnnouncements(
          publishedAnnouncements.slice(0, 3),
        )

        if (user?.unitId) {
          const dues = await getUnitMaintenanceDues(
            selectedSocietyId,
            user.unitId,
          )

          setMaintenanceDueCount(
            dues.filter(
              (due) => due.status !== 'PAID',
            ).length,
          )
        } else {
          setMaintenanceDueCount(0)
        }
      } catch {
        setComplaintCount(0)
        setUpcomingMeetingCount(0)
        setNotificationCount(0)
        setMaintenanceDueCount(0)
        setAnnouncements([])
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [societyId, user?.unitId])

  if (!societyId) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-800">
            Society not selected
          </h1>

          <p className="mt-2 text-sm text-red-700">
            Please return to your account and select a society.
          </p>

          <button
            type="button"
            onClick={() => navigate('/account')}
            className="mt-5 rounded-lg bg-[var(--color-forest-900)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Go to My Account
          </button>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Open complaints',
      value: loading ? '...' : String(complaintCount),
      detail: 'Your active complaints',
      icon: AlertCircle,
      path: 'complaints',
    },
    {
      label: 'Upcoming meetings',
      value: loading ? '...' : String(upcomingMeetingCount),
      detail: 'Scheduled for your society',
      icon: CalendarDays,
      path: 'meetings',
    },
    {
      label: 'Maintenance',
      value: loading
        ? '...'
        : maintenanceDueCount > 0
          ? 'Due'
          : 'Paid',
      detail:
        maintenanceDueCount > 0
          ? `${maintenanceDueCount} unpaid due`
          : 'No pending dues',
      icon: CreditCard,
      path: 'payments',
    },
    {
      label: 'Notifications',
      value: loading ? '...' : String(notificationCount),
      detail: 'Unread notifications',
      icon: Bell,
      path: 'notifications',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-600)]">
          Resident dashboard
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink-950)] sm:text-4xl">
              Good morning, {user?.firstName || 'Resident'}.
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
              Here's what's happening in your community today.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--color-ink-500)]">
            <CheckCircle2 className="h-4 w-4 text-[var(--color-teal-600)]" />
            Society status: All systems normal
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <button
              key={stat.label}
              type="button"
              onClick={() =>
                navigate(
                  `/app/${stat.path}?societyId=${encodeURIComponent(societyId)}`,
                )
              }
              className="rounded-2xl border border-[var(--color-border)] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowRight className="h-4 w-4 text-[var(--color-ink-300)]" />
              </div>

              <p className="mt-5 text-sm text-[var(--color-ink-500)]">
                {stat.label}
              </p>

              <p className="mt-1 text-2xl font-semibold text-[var(--color-ink-950)]">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-[var(--color-ink-400)]">
                {stat.detail}
              </p>
            </button>
          )
        })}
      </section>

      {/* Main content */}
      <section className="grid gap-6 xl:grid-cols-[1fr_1.15fr]">
        {/* Quick actions */}
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <div>
            <p className="text-lg font-semibold text-[var(--color-ink-950)]">
              Quick actions
            </p>

            <p className="mt-1 text-sm text-[var(--color-ink-500)]">
              Common things you may want to do.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon

              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/app/${action.path}?societyId=${encodeURIComponent(societyId)}`,
                    )
                  }
                  className="group rounded-2xl border border-[var(--color-border)] p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--color-teal-200)] hover:bg-[var(--color-teal-50)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-ivory-100)] text-[var(--color-forest-900)] transition group-hover:bg-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-[var(--color-ink-950)]">
                    {action.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[var(--color-ink-500)]">
                    {action.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Society updates */}
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-semibold text-[var(--color-ink-950)]">
                Society updates
              </p>

              <p className="mt-1 text-sm text-[var(--color-ink-500)]">
                Recent announcements from your community.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/app/announcements?societyId=${encodeURIComponent(societyId)}`,
                )
              }
              className="text-xs font-semibold text-[var(--color-teal-600)]"
            >
              View all
            </button>
          </div>

          <div className="mt-6 divide-y divide-[var(--color-border)]">
            {announcements.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[var(--color-ink-500)]">
                  No announcements yet.
                </p>
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
                    <Bell className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-ink-950)]">
                      {announcement.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--color-ink-500)]">
                      {announcement.content}
                    </p>

                    <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink-400)]">
                      {announcement.publishedAt
                        ? new Date(
                            announcement.publishedAt,
                          ).toLocaleDateString()
                        : 'Recently published'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* AI banner */}
      <section className="overflow-hidden rounded-3xl bg-[var(--color-forest-900)] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Sparkles className="h-6 w-6 text-[var(--color-teal-200)]" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-200)]">
                SocietyOS AI
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Need help with something?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                Ask questions about society processes, complaints, meetings,
                maintenance, and everyday community life.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/app/ai-help?societyId=${encodeURIComponent(societyId)}`,
              )
            }
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--color-forest-900)] transition hover:bg-[var(--color-teal-50)]"
          >
            <MessageCircle className="h-4 w-4" />
            Ask SocietyOS AI
          </button>
        </div>
      </section>
    </div>
  )
}