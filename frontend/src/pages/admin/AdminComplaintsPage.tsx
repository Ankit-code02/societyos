import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Loader2,
  RefreshCw,
} from 'lucide-react'

import {
  assignComplaint,
  getSocietyComplaints,
  updateComplaintStatus,
} from '../../services/api/complaintsApi'

import {
  getResidents,
  type Resident,
} from '../../services/api/residentsApi'

import type {
  ComplaintPriority,
  ComplaintResponse,
  ComplaintStatus,
} from '../../types/complaint'
import { useSocietyId } from '../../hooks/useSocietyId'

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
    OPEN: 'bg-amber-50 text-amber-700',
    IN_PROGRESS: 'bg-blue-50 text-blue-700',
    RESOLVED: 'bg-emerald-50 text-emerald-700',
    CLOSED: 'bg-slate-100 text-slate-600',
    CANCELLED: 'bg-red-50 text-red-700',
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
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
    LOW: 'bg-slate-100 text-slate-600',
    MEDIUM: 'bg-blue-50 text-blue-700',
    HIGH: 'bg-orange-50 text-orange-700',
    URGENT: 'bg-red-50 text-red-700',
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[priority]}`}
    >
      {priorityLabels[priority]}
    </span>
  )
}

export default function AdminComplaintsPage() {

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
          </div>
        </div>
      )
    }
  const [complaints, setComplaints] = useState<
    ComplaintResponse[]
  >([])

  const [residents, setResidents] = useState<Resident[]>([])

  const [loading, setLoading] = useState(true)
  const [loadingResidents, setLoadingResidents] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [assigningId, setAssigningId] = useState<string | null>(
    null,
  )

  const [error, setError] = useState('')

  async function loadComplaints(showSpinner = false) {
      if (!societyId) {
        return
      }
    try {
      if (showSpinner) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError('')

      const data =
        await getSocietyComplaints(societyId)

      setComplaints(data)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load complaints.',
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  async function loadResidents() {
      if (!societyId) {
        return
      }
    try {
      setLoadingResidents(true)

      const data = await getResidents(societyId)

      setResidents(
        data.filter(
          (resident) => resident.status === 'ACTIVE',
        ),
      )
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load society members.',
      )
    } finally {
      setLoadingResidents(false)
    }
  }

  useEffect(() => {
    void loadComplaints()
    void loadResidents()
  }, [societyId])

  async function handleAssign(
    complaint: ComplaintResponse,
    assignedToUserId: string,
  ) {
    if (!societyId || !assignedToUserId) {
      return
    }

    try {
      setAssigningId(complaint.id)
      setError('')

      const updated = await assignComplaint(
        societyId,
        complaint.id,
        assignedToUserId,
      )

      setComplaints((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      )
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to assign complaint.',
      )
    } finally {
      setAssigningId(null)
    }
  }

  async function handleStatusChange(
    complaint: ComplaintResponse,
    status: ComplaintStatus,
  ) {
    if (!societyId) {
      return
    }

    let resolutionNote: string | undefined

    if (status === 'RESOLVED') {
      resolutionNote =
        window.prompt(
          'Enter the resolution note:',
        ) || undefined

      if (!resolutionNote?.trim()) {
        return
      }
    }

    try {
      setError('')

      const updated =
        await updateComplaintStatus(
          societyId,
          complaint.id,
          status,
          resolutionNote,
        )

      setComplaints((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      )
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to update complaint.',
      )
    }
  }

  const openCount = complaints.filter(
    (item) => item.status === 'OPEN',
  ).length

  const progressCount = complaints.filter(
    (item) => item.status === 'IN_PROGRESS',
  ).length

  const resolvedCount = complaints.filter(
    (item) =>
      item.status === 'RESOLVED' ||
      item.status === 'CLOSED',
  ).length

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-teal-600)] text-white">
            <ClipboardList className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[var(--color-ink-950)]">
              Complaints
            </h1>

            <p className="mt-2 text-sm text-[var(--color-ink-500)]">
              Review and manage resident complaints.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void loadComplaints(true)}
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
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <AlertCircle className="h-5 w-5 text-amber-600" />

          <p className="mt-4 text-2xl font-semibold">
            {openCount}
          </p>

          <p className="mt-1 text-sm text-[var(--color-ink-500)]">
            Open
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <ClipboardList className="h-5 w-5 text-blue-600" />

          <p className="mt-4 text-2xl font-semibold">
            {progressCount}
          </p>

          <p className="mt-1 text-sm text-[var(--color-ink-500)]">
            In progress
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <p className="mt-4 text-2xl font-semibold">
            {resolvedCount}
          </p>

          <p className="mt-1 text-sm text-[var(--color-ink-500)]">
            Resolved / closed
          </p>
        </div>
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
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-teal-600)]" />
        </div>
      ) : complaints.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white px-6 py-16 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-[var(--color-ink-300)]" />

          <h2 className="mt-4 text-lg font-semibold">
            No complaints found
          </h2>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {complaints.map((complaint) => (
            <article
              key={complaint.id}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-6"
            >
              <div className="flex flex-col gap-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-teal-600)]">
                      {complaint.category}
                    </span>

                    <StatusBadge
                      status={complaint.status}
                    />

                    <PriorityBadge
                      priority={complaint.priority}
                    />
                  </div>

                  <h2 className="mt-3 text-lg font-semibold text-[var(--color-ink-950)]">
                    {complaint.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--color-ink-600)]">
                    {complaint.description}
                  </p>

                  <div className="mt-4 grid gap-2 text-xs text-[var(--color-ink-500)] sm:grid-cols-2">
                    <span>
                      Resident:{' '}
                      {complaint.createdByEmail}
                    </span>

                    <span>
                      Unit:{' '}
                      {complaint.unitNumber ||
                        'Not assigned'}
                    </span>

                    <span>
                      Created:{' '}
                      {new Date(
                        complaint.createdAt,
                      ).toLocaleString()}
                    </span>

                    <span>
                      Assigned:{' '}
                      {complaint.assignedToEmail ||
                        'Not assigned'}
                    </span>
                  </div>

                  {complaint.resolutionNote && (
                    <div className="mt-4 rounded-xl bg-emerald-50 p-4">
                      <p className="text-xs font-semibold text-emerald-800">
                        Resolution note
                      </p>

                      <p className="mt-1 text-sm text-emerald-700">
                        {complaint.resolutionNote}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 border-t border-[var(--color-border)] pt-5 lg:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`assign-${complaint.id}`}
                      className="text-xs font-semibold text-[var(--color-ink-500)]"
                    >
                      Assign to
                    </label>

                    <select
                      id={`assign-${complaint.id}`}
                      value=""
                      onChange={(event) => {
                        void handleAssign(
                          complaint,
                          event.target.value,
                        )
                      }}
                      disabled={
                        loadingResidents ||
                        assigningId === complaint.id ||
                        complaint.status === 'CLOSED' ||
                        complaint.status === 'CANCELLED'
                      }
                      className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm"
                    >
                      <option value="">
                        {loadingResidents
                          ? 'Loading members...'
                          : complaint.assignedToEmail
                            ? 'Change assignee...'
                            : 'Select society member...'}
                      </option>

                      {residents.map((resident) => (
                        <option
                          key={resident.userId}
                          value={resident.userId}
                        >
                          {resident.email}
                          {resident.position
                            ? ` · ${resident.position}`
                            : ''}
                        </option>
                      ))}
                    </select>

                    {assigningId === complaint.id && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-teal-600)]">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Assigning complaint...
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`status-${complaint.id}`}
                      className="text-xs font-semibold text-[var(--color-ink-500)]"
                    >
                      Update status
                    </label>

                    <select
                      id={`status-${complaint.id}`}
                      value={complaint.status}
                      onChange={(event) =>
                        void handleStatusChange(
                          complaint,
                          event.target
                            .value as ComplaintStatus,
                        )
                      }
                      disabled={
                        complaint.status === 'CLOSED' ||
                        complaint.status === 'CANCELLED'
                      }
                      className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm"
                    >
                      <option value="OPEN">
                        Open
                      </option>

                      <option value="IN_PROGRESS">
                        In progress
                      </option>

                      <option value="RESOLVED">
                        Resolved
                      </option>

                      <option value="CLOSED">
                        Closed
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>
                    </select>
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