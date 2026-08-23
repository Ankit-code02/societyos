import {
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Megaphone,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSocietyId } from '../../hooks/useSocietyId'

const sections = [

  {
    title: 'Society Structure',
    description: 'Manage buildings and flats in your society.',
    icon: Building2,
    path: '/admin/society',
  },
  {
    title: 'Residents',
    description: 'View and manage society residents.',
    icon: Users,
    path: '/admin/residents',
  },
  {
    title: 'Complaints',
    description: 'Review, assign and update complaints.',
    icon: ClipboardList,
    path: '/admin/complaints',
  },
  {
    title: 'Meetings',
    description: 'Schedule and manage society meetings.',
    icon: CalendarDays,
    path: '/admin/meetings',
  },
  {
    title: 'Announcements',
    description: 'Manage important society announcements.',
    icon: Megaphone,
    path: '/admin/announcements',
  },
]

export default function AdminDashboardPage() {
  const societyId = useSocietyId()

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

          <Link
            to="/account"
            className="mt-5 inline-flex rounded-lg bg-[var(--color-forest-900)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Back to Account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-teal-600)] text-white">
          <Building2 className="h-6 w-6" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
            SocietyOS
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[var(--color-ink-950)]">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            Manage your society from one place.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon

          return (
            <Link
              key={section.path}
              to={`${section.path}?societyId=${encodeURIComponent(societyId)}`}
              className="group rounded-2xl border border-[var(--color-border)] bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-ivory-100)]">
                  <Icon className="h-5 w-5 text-[var(--color-teal-600)]" />
                </div>

                <ChevronRight className="h-5 w-5 text-[var(--color-ink-300)] transition group-hover:translate-x-1" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-[var(--color-ink-900)]">
                {section.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                {section.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}