import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useSocietyId } from '../../hooks/useSocietyId'
import { createComplaint } from '../../services/api/complaintsApi'
import type {
  ComplaintCategory
} from '../../types/complaint'


const complaintSchema = z.object({
  category: z.enum([
    'MAINTENANCE',
    'SECURITY',
    'CLEANLINESS',
    'WATER',
    'ELECTRICITY',
    'PARKING',
    'NOISE',
    'OTHER',
  ]),
  title: z
    .string()
    .trim()
    .min(3, 'Please enter a title')
    .max(150, 'Title cannot exceed 150 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Please provide a little more detail')
    .max(5000, 'Description cannot exceed 5000 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
})

type ComplaintFormValues = z.infer<typeof complaintSchema>

const categories: {
  value: ComplaintCategory
  label: string
  description: string
}[] = [
  {
    value: 'MAINTENANCE',
    label: 'Maintenance',
    description: 'Repairs and common facilities',
  },
  {
    value: 'SECURITY',
    label: 'Security',
    description: 'Safety or security concerns',
  },
  {
    value: 'CLEANLINESS',
    label: 'Cleanliness',
    description: 'Cleaning and waste issues',
  },
  {
    value: 'WATER',
    label: 'Water',
    description: 'Supply or leakage issues',
  },
  {
    value: 'ELECTRICITY',
    label: 'Electricity',
    description: 'Power and electrical issues',
  },
  {
    value: 'PARKING',
    label: 'Parking',
    description: 'Parking-related issues',
  },
  {
    value: 'NOISE',
    label: 'Noise',
    description: 'Noise or disturbance',
  },
  {
    value: 'OTHER',
    label: 'Other',
    description: 'Anything else',
  },
]

export default function CreateComplaintPage() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')
  const societyId = useSocietyId()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      category: 'MAINTENANCE',
      priority: 'MEDIUM',
      title: '',
      description: '',
    },
  })

  const onSubmit = async (values: ComplaintFormValues) => {
    setSubmitError('')

    try {
      if (!societyId) {
        setSubmitError(
          'No society is selected. Please return to your account and select a society.',
        )
        return
      }

      await createComplaint(societyId, {
        category: values.category,
        title: values.title,
        description: values.description,
        priority: values.priority,
      })

      navigate(
        `/app/complaints?societyId=${encodeURIComponent(societyId)}`,
      )
    } catch {
      setSubmitError(
        'We could not submit your complaint. Please try again.',
      )
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <section>
        <Link
          to={`/app/complaints?societyId=${encodeURIComponent(societyId ?? '')}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink-500)] hover:text-[var(--color-forest-900)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to complaints
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-600)]">
            Helpdesk
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink-950)] sm:text-4xl">
            Raise a complaint
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-ink-500)]">
            Tell your society team what happened and we'll help get it to
            the right place.
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Category */}
        <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">
              What is the issue about?
            </h2>

            <p className="mt-1 text-sm text-[var(--color-ink-500)]">
              Choose the category that best describes the problem.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <label
                key={category.value}
                className="group cursor-pointer"
              >
                <input
                  type="radio"
                  value={category.value}
                  {...register('category')}
                  className="peer sr-only"
                />

                <div className="rounded-2xl border border-[var(--color-border)] p-4 transition peer-checked:border-[var(--color-forest-900)] peer-checked:bg-[var(--color-teal-50)] hover:border-[var(--color-teal-200)]">
                  <p className="text-sm font-semibold text-[var(--color-ink-950)]">
                    {category.label}
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                    {category.description}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {errors.category && (
            <p className="mt-3 text-xs text-red-600">
              Please choose a category.
            </p>
          )}
        </section>

        {/* Details */}
        <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">
              Tell us more
            </h2>

            <p className="mt-1 text-sm text-[var(--color-ink-500)]">
              Clear details help the society team resolve the issue faster.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="title"
                className="text-sm font-semibold text-[var(--color-ink-800)]"
              >
                Complaint title
              </label>

              <input
                id="title"
                {...register('title')}
                placeholder="Example: Water leaking from bathroom pipe"
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory-50)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--color-ink-300)] focus:border-[var(--color-teal-500)] focus:bg-white focus:ring-4 focus:ring-[var(--color-teal-100)]"
              />

              {errors.title && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-semibold text-[var(--color-ink-800)]"
              >
                Description
              </label>

              <textarea
                id="description"
                {...register('description')}
                rows={6}
                placeholder="Describe what happened, where it happened, and anything else the society team should know."
                className="mt-2 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory-50)] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[var(--color-ink-300)] focus:border-[var(--color-teal-500)] focus:bg-white focus:ring-4 focus:ring-[var(--color-teal-100)]"
              />

              {errors.description && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Priority */}
        <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">
              How urgent is it?
            </h2>

            <p className="mt-1 text-sm text-[var(--color-ink-500)]">
              Select the priority that best matches the situation.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {[
              ['LOW', 'Low', 'Can wait'],
              ['MEDIUM', 'Medium', 'Normal issue'],
              ['HIGH', 'High', 'Needs attention'],
              ['URGENT', 'Urgent', 'Immediate attention'],
            ].map(([value, label, description]) => (
              <label
                key={value}
                className="cursor-pointer"
              >
                <input
                  type="radio"
                  value={value}
                  {...register('priority')}
                  className="peer sr-only"
                />

                <div className="rounded-2xl border border-[var(--color-border)] p-4 text-center transition peer-checked:border-[var(--color-forest-900)] peer-checked:bg-[var(--color-teal-50)]">
                  <p className="text-sm font-semibold text-[var(--color-ink-950)]">
                    {label}
                  </p>

                  <p className="mt-1 text-[11px] text-[var(--color-ink-500)]">
                    {description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* AI hint */}
        <div className="flex gap-4 rounded-2xl border border-[var(--color-teal-200)] bg-[var(--color-teal-50)] p-5">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-teal-600)]" />

          <div>
            <p className="text-sm font-semibold text-[var(--color-forest-900)]">
              SocietyOS tip
            </p>

            <p className="mt-1 text-xs leading-5 text-[var(--color-ink-600)]">
              Include the location and what you observed. This helps the
              society team assign the complaint to the right person.
            </p>
          </div>
        </div>

        {/* Error */}
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to={`/app/complaints?societyId=${encodeURIComponent(societyId ?? '')}`}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-ink-700)] hover:bg-[var(--color-ivory-100)]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-forest-900)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-forest-800)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />

            {isSubmitting ? 'Submitting...' : 'Submit complaint'}
          </button>
        </div>
      </form>
    </div>
  )
}