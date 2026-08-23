import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  IndianRupee,
  Loader2,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react'

import {
  createMaintenanceDue,
  getSocietyMaintenanceDues,
  markMaintenanceDueAsPaid,
} from '../../services/api/maintenanceApi'

import {
  getBuildings,
  getUnits,
} from '../../services/api/societyApi'

import type { Building, Unit } from '../../types/society'
import type { MaintenanceDueResponse } from '../../types/maintenance'
import { useSocietyId } from '../../hooks/useSocietyId'

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export default function AdminMaintenancePage() {
  const societyId = useSocietyId()
  const [dues, setDues] = useState<
    MaintenanceDueResponse[]
  >([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const [buildings, setBuildings] = useState<Building[]>([])
  const [units, setUnits] = useState<Unit[]>([])

  const [buildingId, setBuildingId] = useState('')
  const [unitId, setUnitId] = useState('')

  const [loadingBuildings, setLoadingBuildings] = useState(false)
  const [loadingUnits, setLoadingUnits] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  async function loadBuildings() {
    if (!societyId) {
      return
    }

    try {
      setLoadingBuildings(true)

      const data = await getBuildings(societyId)

      setBuildings(data)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load buildings.',
      )
    } finally {
      setLoadingBuildings(false)
    }
  }
  async function loadDues(showRefresh = false) {
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

      const data =
        await getSocietyMaintenanceDues(
          societyId,
        )

      setDues(data)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load maintenance dues.',
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

useEffect(() => {
  loadDues()
  loadBuildings()
}, [societyId])

  async function handleBuildingChange(
    selectedBuildingId: string,
  ) {
    setBuildingId(selectedBuildingId)
    setUnitId('')
    setUnits([])

    if (!selectedBuildingId) {
      return
    }

    if (!societyId) {
      return
    }

    try {
      setLoadingUnits(true)

      const data = await getUnits(
        societyId,
        selectedBuildingId,
      )

      setUnits(data)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load units.',
      )
    } finally {
      setLoadingUnits(false)
    }
  }

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

      const created =
        await createMaintenanceDue(
          societyId,
          {
            unitId: unitId.trim(),
            title: title.trim(),
            description:
              description.trim() || undefined,
            amount: Number(amount),
            dueDate,
          },
        )

      setDues((current) => [
        created,
        ...current,
      ])

      setBuildingId('')
      setUnitId('')
      setUnits([])
      setTitle('')
      setDescription('')
      setAmount('')
      setDueDate('')
      setShowForm(false)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to create maintenance due.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleMarkPaid(
    dueId: string,
  ) {
    const confirmed = window.confirm(
      'Mark this maintenance due as paid?',
    )

    if (!confirmed) {
      return
    }
if (!societyId) {
  return
}

    try {
      setError('')

      const updated =
        await markMaintenanceDueAsPaid(
          societyId,
          dueId,
        )

      setDues((current) =>
        current.map((due) =>
          due.id === updated.id
            ? updated
            : due,
        ),
      )
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to mark due as paid.',
      )
    }
  }

  const pendingDues = dues.filter(
    (due) => due.status === 'PENDING',
  )

  const paidDues = dues.filter(
    (due) => due.status === 'PAID',
  )

  const outstandingAmount = pendingDues.reduce(
    (total, due) => total + due.amount,
    0,
  )

  const paidAmount = paidDues.reduce(
    (total, due) => total + due.amount,
    0,
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
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
            Administration
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[var(--color-ink-950)]">
            Maintenance
          </h1>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            Manage society maintenance dues and payments.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => loadDues(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? 'animate-spin'
                  : ''
              }`}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              setShowForm(
                (current) => !current,
              )
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-600)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            {showForm ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}

            {showForm
              ? 'Close'
              : 'Create due'}
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
          <h2 className="text-lg font-semibold">
            Create maintenance due
          </h2>

          <div className="mt-6 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">
                  Building
                </label>

                <select
                  required
                  value={buildingId}
                  onChange={(event) =>
                    handleBuildingChange(event.target.value)
                  }
                  disabled={loadingBuildings}
                  className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm"
                >
                  <option value="">
                    {loadingBuildings
                      ? 'Loading buildings...'
                      : 'Select building'}
                  </option>

                  {buildings.map((building) => (
                    <option
                      key={building.id}
                      value={building.id}
                    >
                      {building.name} ({building.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Unit
                </label>

                <select
                  required
                  value={unitId}
                  onChange={(event) =>
                    setUnitId(event.target.value)
                  }
                  disabled={
                    !buildingId ||
                    loadingUnits
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm"
                >
                  <option value="">
                    {loadingUnits
                      ? 'Loading units...'
                      : !buildingId
                        ? 'Select building first'
                        : 'Select unit'}
                  </option>

                  {units.map((unit) => (
                    <option
                      key={unit.id}
                      value={unit.id}
                    >
                      Unit {unit.unitNumber} · Floor {unit.floorNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">
                Title
              </label>

              <input
                required
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value,
                  )
                }
                placeholder="August maintenance"
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Description
              </label>

              <textarea
                rows={3}
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="Monthly maintenance charges"
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">
                  Amount
                </label>

                <input
                  required
                  min="1"
                  step="0.01"
                  type="number"
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value,
                    )
                  }
                  placeholder="2500"
                  className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Due date
                </label>

                <input
                  required
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
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
              Create due
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <IndianRupee className="h-5 w-5 text-amber-600" />

          <p className="mt-4 text-2xl font-semibold">
            {formatAmount(
              outstandingAmount,
            )}
          </p>

          <p className="mt-1 text-sm text-[var(--color-ink-500)]">
            Outstanding
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <p className="mt-4 text-2xl font-semibold">
            {formatAmount(paidAmount)}
          </p>

          <p className="mt-1 text-sm text-[var(--color-ink-500)]">
            Paid
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-sm text-[var(--color-ink-500)]">
            Total entries
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {dues.length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-teal-600)]" />
        </div>
      ) : dues.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] bg-white px-6 py-16 text-center">
          <IndianRupee className="mx-auto h-10 w-10 text-[var(--color-ink-300)]" />

          <h2 className="mt-4 text-lg font-semibold">
            No maintenance dues
          </h2>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {dues.map((due) => {
            const paid = due.status === 'PAID'

            return (
              <article
                key={due.id}
                className="rounded-2xl border border-[var(--color-border)] bg-white p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">
                        {due.title}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          paid
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {paid
                          ? 'PAID'
                          : 'PENDING'}
                      </span>
                    </div>

                    {due.description && (
                      <p className="mt-1 text-sm text-[var(--color-ink-500)]">
                        {due.description}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--color-ink-400)]">
                      <span>
                        Unit {due.unitNumber}
                      </span>

                      <span>
                        Due{' '}
                        {formatDate(
                          due.dueDate,
                        )}
                      </span>

                      {due.paidAt && (
                        <span>
                          Paid{' '}
                          {formatDate(
                            due.paidAt,
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold">
                      {formatAmount(
                        due.amount,
                      )}
                    </p>

                    {!paid && (
                      <button
                        type="button"
                        onClick={() =>
                          handleMarkPaid(
                            due.id,
                          )
                        }
                        className="rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        Mark paid
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}