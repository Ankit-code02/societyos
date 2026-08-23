import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  RefreshCw,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { useSocietyId } from '../../hooks/useSocietyId'
import { getMyComplaints } from '../../services/api/complaintsApi'
import type {
  ComplaintPriority,
  ComplaintResponse,
  ComplaintStatus,
} from '../../types/complaint'

const statusLabels: Record<ComplaintStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled',
}

const priorityLabels: Record<ComplaintPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
}

function StatusBadge({
  status,
}: {
  status: ComplaintStatus
}) {
  const styles: Record<ComplaintStatus, string> = {
    OPEN: 'bg-amber-50 text-amber-700 border-amber-200',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CLOSED: 'bg-slate-50 text-slate-600 border-slate-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}

function PriorityBadge({
  priority,
}: {
  priority?: ComplaintPriority
}) {
  if (!priority) {
    return null
  }

  const styles: Record<ComplaintPriority, string> = {
    LOW: 'bg-slate-50 text-slate-600',
    MEDIUM: 'bg-blue-50 text-blue-700',
    HIGH: 'bg-orange-50 text-orange-700',
    URGENT: 'bg-red-50 text-red-700',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[priority]}`}
    >
      {priorityLabels[priority]}
    </span>
  )
}

function ComplaintCard({
  complaint,
}: {
  complaint: ComplaintResponse
}) {
  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-teal-600)]">
                {complaint.category}
              </p>

              <span className="text-[var(--color-ink-300)]">•</span>

              <p className="text-[11px] text-[var(--color-ink-400)]">
                {new Date(
                  complaint.createdAt,
                ).toLocaleDateString()}
              </p>
            </div>

            <h2 className="mt-2 text-base font-semibold text-[var(--color-ink-950)]">
              {complaint.title}
            </h2>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-ink-500)]">
              {complaint.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-ink-400)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <span>
            Complaint ID: {complaint.id.slice(0, 8)}
          </span>

          {complaint.unitNumber && (
            <span>Unit: {complaint.unitNumber}</span>
          )}
        </div>

        {complaint.assignedToEmail && (
          <span>
            Assigned to {complaint.assignedToEmail}
          </span>
        )}
      </div>
    </article>
  )
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: typeof AlertCircle
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-2xl font-semibold text-[var(--color-ink-950)]">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm text-[var(--color-ink-500)]">
        {label}
      </p>
    </div>
  )
}

export default function ComplaintsPage() {
  const societyId = useSocietyId()

  const {
    data: complaints = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['my-complaints', societyId],
    queryFn: () => {
      if (!societyId) {
        throw new Error('Society ID is required')
      }

      return getMyComplaints(societyId)
    },
    enabled: Boolean(societyId),
  })

  const openCount = complaints.filter(
    (complaint) => complaint.status === 'OPEN',
  ).length

  const inProgressCount = complaints.filter(
    (complaint) => complaint.status === 'IN_PROGRESS',
  ).length

  const resolvedCount = complaints.filter(
    (complaint) =>
      complaint.status === 'RESOLVED' ||
      complaint.status === 'CLOSED',
  ).length

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
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-600)]">
            Helpdesk
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink-950)] sm:text-4xl">
            Your complaints
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-ink-500)]">
            Report an issue, follow its progress, and stay updated until it
            is resolved.
          </p>
        </div>

        <Link
          to={`/app/complaints/new?societyId=${encodeURIComponent(societyId)}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-forest-900)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-forest-800)]"
        >
          <Plus className="h-4 w-4" />
          Raise complaint
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Open"
          value={openCount}
          icon={AlertCircle}
        />

        <SummaryCard
          label="In progress"
          value={inProgressCount}
          icon={Clock3}
        />

        <SummaryCard
          label="Resolved"
          value={resolvedCount}
          icon={CheckCircle2}
        />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">
              Recent complaints
            </h2>

            <p className="mt-1 text-xs text-[var(--color-ink-400)]">
              {complaints.length} complaint
              {complaints.length === 1 ? '' : 's'} found
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--color-ink-600)] hover:bg-[var(--color-ivory-100)] disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isFetching ? 'animate-spin' : ''
              }`}
            />
            Refresh
          </button>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl border border-[var(--color-border)] bg-white"
              />
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-800">
              We couldn't load your complaints.
            </p>

            <p className="mt-1 text-sm text-red-700">
              Please check your connection and try again.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-xs font-semibold text-white"
            >
              Try again
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {!isLoading &&
          !isError &&
          complaints.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[var(--color-border)] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[var(--color-ink-950)]">
                No complaints yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-ink-500)]">
                Everything looks clear. If you notice an issue in your society,
                you can report it here.
              </p>

              <Link
                to={`/app/complaints/new?societyId=${encodeURIComponent(societyId)}`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-forest-900)] px-5 py-3 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Raise a complaint
              </Link>
            </div>
          )}

        {!isLoading &&
          !isError &&
          complaints.length > 0 && (
            <div className="space-y-3">
              {complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                />
              ))}
            </div>
          )}
      </section>
    </div>
  )
}