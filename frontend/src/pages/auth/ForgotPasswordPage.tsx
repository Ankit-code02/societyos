import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'

import { forgotPassword } from '../../services/api/passwordApi'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await forgotPassword({ email })

      navigate('/reset-password', {
        state: {
          userId: response.userId,
          email,
        },
      })
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to send the password reset OTP.',
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
              Forgot your password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
              Enter your registered email address and we'll send you a
              verification OTP.
            </p>
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
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[var(--color-ink-800)]"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory-50)] px-4 text-sm text-[var(--color-ink-950)] outline-none transition placeholder:text-[var(--color-ink-400)] focus:border-[var(--color-teal-500)] focus:ring-4 focus:ring-[var(--color-teal-500)]/10"
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
                  Sending OTP...
                </>
              ) : (
                <>
                  Send reset OTP
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