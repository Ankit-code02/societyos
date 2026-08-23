import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'

import { resetPassword } from '../../services/api/passwordApi'

interface LocationState {
  userId?: string
  email?: string
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = (location.state as LocationState | null) ?? {}

  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')

    if (!state.userId) {
      setError('Password reset session is missing. Please start again.')
      return
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter the 6-digit OTP.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await resetPassword({
        userId: state.userId,
        otp,
        newPassword,
        confirmPassword,
      })

      navigate('/login', {
        state: {
          message: 'Password reset successfully. You can now log in.',
        },
      })
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to reset your password. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-ivory-100)] px-6 py-10 sm:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-white p-7 shadow-xl sm:p-10">

          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-forest-900)] font-bold text-white">
                S
              </div>

              <div className="text-left">
                <p className="font-bold text-[var(--color-ink-950)]">
                  SocietyOS
                </p>
                <p className="text-[10px] tracking-[0.15em] text-[var(--color-ink-500)]">
                  COMMUNITY PLATFORM
                </p>
              </div>
            </Link>

            <p className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
              Password recovery
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink-950)]">
              Create a new password
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
              Enter the OTP from your email and choose a new password.
            </p>

            {state.email && (
              <p className="mt-2 text-xs font-medium text-[var(--color-ink-500)]">
                {state.email}
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="otp"
                className="mb-2 block text-sm font-semibold text-[var(--color-ink-800)]"
              >
                Reset OTP
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, ''))
                }
                placeholder="123456"
                className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory-50)] px-4 text-center text-xl tracking-[0.4em] outline-none focus:border-[var(--color-teal-500)] focus:ring-4 focus:ring-[var(--color-teal-500)]/10"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-semibold text-[var(--color-ink-800)]"
              >
                New password
              </label>

              <input
                id="newPassword"
                type="password"
                required
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter your new password"
                className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory-50)] px-4 text-sm outline-none focus:border-[var(--color-teal-500)] focus:ring-4 focus:ring-[var(--color-teal-500)]/10"
              />

              <p className="mt-2 text-xs text-[var(--color-ink-400)]">
                Use 8+ characters with uppercase, lowercase, number and special character.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-[var(--color-ink-800)]"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your new password"
                className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory-50)] px-4 text-sm outline-none focus:border-[var(--color-teal-500)] focus:ring-4 focus:ring-[var(--color-teal-500)]/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-forest-900)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-forest-800)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                <>
                  Reset password
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-[var(--color-teal-600)] hover:text-[var(--color-forest-900)]"
            >
              ← Back to login
            </Link>
          </div>

        </div>
      </div>
    </main>
  )
}