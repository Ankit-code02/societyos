import { useState, type FormEvent } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'

import { register } from '../../services/api/authApi'

export default function SignupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const invitationToken =
    searchParams.get('invitationToken')

  const invitationEmail =
    searchParams.get('email')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: invitationEmail || '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (
      invitationToken &&
      invitationEmail &&
      form.email.trim().toLowerCase() !==
        invitationEmail.trim().toLowerCase()
    ) {
      setError(
        'Please use the email address associated with your invitation.',
      )
      return
    }

    setLoading(true)

    try {
      const response = await register(form)

      navigate('/verify-otp', {
        state: {
          userId: response.userId,
          email: form.email,
          invitationToken:
            invitationToken || undefined,
        },
      })
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to create your account. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-ivory-100)] px-5 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-xl font-bold text-[var(--color-forest-900)]"
          >
            SocietyOS
          </Link>

          <h1 className="mt-8 text-3xl font-bold text-[var(--color-ink-950)]">
            {invitationToken
              ? 'Join your society'
              : 'Create your account'}
          </h1>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            {invitationToken
              ? 'Complete your account to join your residential community.'
              : 'Join your residential community on SocietyOS.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {invitationToken && (
            <div className="mb-5 rounded-xl border border-[var(--color-teal-200)] bg-[var(--color-teal-50)] px-4 py-3 text-sm text-[var(--color-teal-800)]">
              You're registering through a resident
              invitation. Your account will be linked
              to the invited society after email
              verification.
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-[var(--color-ink-700)]">
                First name
              </span>

              <input
                required
                value={form.firstName}
                onChange={(event) =>
                  updateField(
                    'firstName',
                    event.target.value,
                  )
                }
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-forest-900)]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[var(--color-ink-700)]">
                Last name
              </span>

              <input
                required
                value={form.lastName}
                onChange={(event) =>
                  updateField(
                    'lastName',
                    event.target.value,
                  )
                }
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-forest-900)]"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-[var(--color-ink-700)]">
              Email
            </span>

            <input
              required
              type="email"
              value={form.email}
              readOnly={Boolean(invitationToken)}
              onChange={(event) =>
                updateField(
                  'email',
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-forest-900)] read-only:bg-[var(--color-ivory-100)]"
            />

            {invitationToken && (
              <span className="mt-1 block text-xs text-[var(--color-ink-400)]">
                This email is locked to your resident
                invitation.
              </span>
            )}
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-[var(--color-ink-700)]">
              Phone
            </span>

            <input
              required
              type="tel"
              placeholder="+919876543210"
              value={form.phone}
              onChange={(event) =>
                updateField(
                  'phone',
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-forest-900)]"
            />

            <span className="mt-1 block text-xs text-[var(--color-ink-400)]">
              Use international format, for example
              +919876543210.
            </span>
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-[var(--color-ink-700)]">
              Password
            </span>

            <input
              required
              type="password"
              value={form.password}
              onChange={(event) =>
                updateField(
                  'password',
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-forest-900)]"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-[var(--color-ink-700)]">
              Confirm password
            </span>

            <input
              required
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                updateField(
                  'confirmPassword',
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-forest-900)]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-forest-900)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--color-forest-800)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                {invitationToken
                  ? 'Continue to Verification'
                  : 'Create account'}

                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="mt-6 text-center text-sm text-[var(--color-ink-500)]">
            Already have an account?{' '}
            <Link
              to={
                invitationToken
                  ? `/login?invitationToken=${encodeURIComponent(
                      invitationToken,
                    )}`
                  : '/login'
              }
              className="font-semibold text-[var(--color-forest-900)]"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}