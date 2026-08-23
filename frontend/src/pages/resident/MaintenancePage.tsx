import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  getSocietyMaintenanceDues,
  makeDemoMaintenancePayment,
  type DemoPaymentResponse,
} from '../../services/api/maintenanceApi'
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

function StatusBadge({
  status,
}: {
  status: MaintenanceDueResponse['status']
}) {
  if (status === 'PAID') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Paid
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
      <Clock3 className="h-3.5 w-3.5" />
      Pending
    </span>
  )
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  description,
}: {
  label: string
  value: string
  icon: typeof IndianRupee
  description: string
}) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
          <Icon className="h-5 w-5" />
        </div>

        <p className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-ink-950)]">
          {value}
        </p>
      </div>

      <p className="mt-5 text-sm font-semibold text-[var(--color-ink-800)]">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-[var(--color-ink-400)]">
        {description}
      </p>
    </div>
  )
}

function DueCard({
  due,
  onPay,
}: {
  due: MaintenanceDueResponse
  onPay: (due: MaintenanceDueResponse) => void
}) {
  const isPaid = due.status === 'PAID'

  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isPaid
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            <IndianRupee className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-[var(--color-ink-950)]">
                {due.title}
              </h3>

              <StatusBadge status={due.status} />
            </div>

            {due.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-ink-500)]">
                {due.description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-ink-400)]">
              <span>Unit {due.unitNumber}</span>
              <span>Due {formatDate(due.dueDate)}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-lg font-semibold text-[var(--color-ink-950)]">
            {formatAmount(due.amount)}
          </p>

          {isPaid && due.paidAt ? (
            <p className="mt-1 text-xs text-emerald-600">
              Paid {formatDate(due.paidAt)}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => onPay(due)}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-[var(--color-teal-600)] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[var(--color-forest-900)]"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default function MaintenancePage() {
  const societyId = useSocietyId()

  const [selectedDue, setSelectedDue] =
    useState<MaintenanceDueResponse | null>(null)

  const [payment, setPayment] =
    useState<DemoPaymentResponse | null>(null)

  const [isPaying, setIsPaying] = useState(false)

  const [paymentError, setPaymentError] = useState('')

  const {
    data: dues = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['maintenance-dues', societyId],
    queryFn: () => {
      if (!societyId) {
        throw new Error('Society ID is required')
      }

      return getSocietyMaintenanceDues(societyId)
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

  const totalAmount = dues.reduce(
    (total, due) => total + due.amount,
    0,
  )

  const sortedDues = [...dues].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'PENDING' ? -1 : 1
    }

    return (
      new Date(b.dueDate).getTime() -
      new Date(a.dueDate).getTime()
    )
  })

  async function handleDemoPayment() {
    if (!selectedDue || !societyId) {
      return
    }

    setIsPaying(true)
    setPaymentError('')

    try {
      const result = await makeDemoMaintenancePayment(
        societyId,
        selectedDue.id,
      )

      setPayment(result)
      setSelectedDue(null)

      await refetch()
    } catch (error: any) {
      setPaymentError(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to complete the demo payment.',
      )
    } finally {
      setIsPaying(false)
    }
  }

  function closePaymentModal() {
    if (isPaying) {
      return
    }

    setSelectedDue(null)
    setPaymentError('')
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-600)]">
            Finance
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink-950)] sm:text-4xl">
            Maintenance dues
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-ink-500)]">
            Keep track of your society maintenance dues and payment
            history in one place.
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

      {isLoading && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-3xl border border-[var(--color-border)] bg-white"
              />
            ))}
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl border border-[var(--color-border)] bg-white"
              />
            ))}
          </div>
        </>
      )}

      {isError && !isLoading && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="font-semibold text-red-800">
                We couldn't load your maintenance dues.
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
          <section className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Outstanding"
              value={formatAmount(outstandingAmount)}
              icon={AlertCircle}
              description={`${pendingDues.length} pending ${
                pendingDues.length === 1 ? 'due' : 'dues'
              }`}
            />

            <SummaryCard
              label="Paid"
              value={formatAmount(paidAmount)}
              icon={CheckCircle2}
              description={`${paidDues.length} ${
                paidDues.length === 1
                  ? 'payment'
                  : 'payments'
              } recorded`}
            />

            <SummaryCard
              label="Total tracked"
              value={formatAmount(totalAmount)}
              icon={IndianRupee}
              description={`${dues.length} ${
                dues.length === 1 ? 'entry' : 'entries'
              } in your history`}
            />
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">
                Outstanding dues
              </h2>

              <p className="mt-1 text-xs text-[var(--color-ink-400)]">
                Items that still need your attention
              </p>
            </div>

            {pendingDues.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--color-border)] bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[var(--color-ink-950)]">
                  You're all caught up
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-ink-500)]">
                  There are no pending maintenance dues for your society.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingDues.map((due) => (
                  <DueCard
                    key={due.id}
                    due={due}
                    onPay={setSelectedDue}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">
                Maintenance history
              </h2>

              <p className="mt-1 text-xs text-[var(--color-ink-400)]">
                Your previously recorded maintenance entries
              </p>
            </div>

            {sortedDues.length === 0 ? (
              <div className="rounded-3xl border border-[var(--color-border)] bg-white p-10 text-center">
                <p className="text-sm text-[var(--color-ink-500)]">
                  No maintenance records are available yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedDues.map((due) => (
                  <DueCard
                    key={due.id}
                    due={due}
                    onPay={setSelectedDue}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {selectedDue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-600)]">
                  Demo payment
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink-950)]">
                  Confirm payment
                </h2>
              </div>

              <button
                type="button"
                onClick={closePaymentModal}
                disabled={isPaying}
                className="rounded-xl p-2 text-[var(--color-ink-500)] hover:bg-[var(--color-ivory-100)] disabled:opacity-50"
                aria-label="Close payment dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-[var(--color-ivory-100)] p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[var(--color-ink-500)]">
                  Maintenance
                </span>

                <span className="text-sm font-semibold text-[var(--color-ink-900)]">
                  {selectedDue.title}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-[var(--color-ink-500)]">
                  Unit
                </span>

                <span className="text-sm font-semibold text-[var(--color-ink-900)]">
                  {selectedDue.unitNumber}
                </span>
              </div>

              <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-[var(--color-ink-700)]">
                    Amount
                  </span>

                  <span className="text-2xl font-bold text-[var(--color-ink-950)]">
                    {formatAmount(selectedDue.amount)}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-[var(--color-ink-400)]">
              This is a demo payment for SocietyOS V1. No real money
              will be charged.
            </p>

            {paymentError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {paymentError}
              </div>
            )}

            <button
              type="button"
              onClick={handleDemoPayment}
              disabled={isPaying}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-teal-600)] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--color-forest-900)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPaying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing demo payment...
                </>
              ) : (
                <>
                  Pay {formatAmount(selectedDue.amount)}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {payment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-600)]">
              Payment successful
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ink-950)]">
              Demo payment completed
            </h2>

            <p className="mt-2 text-sm text-[var(--color-ink-500)]">
              Your maintenance due has been marked as paid.
            </p>

            <div className="mt-6 rounded-2xl bg-[var(--color-ivory-100)] p-5 text-left">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[var(--color-ink-500)]">
                  Amount
                </span>

                <span className="font-semibold text-[var(--color-ink-950)]">
                  {formatAmount(payment.amount)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-[var(--color-ink-500)]">
                  Transaction
                </span>

                <span className="text-xs font-semibold text-[var(--color-ink-800)]">
                  {payment.transactionReference}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPayment(null)}
              className="mt-6 w-full rounded-xl bg-[var(--color-teal-600)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-forest-900)]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}