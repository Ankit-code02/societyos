import {
  useState,
  type FormEvent,
} from 'react'

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  ArrowRight,
  Loader2,
  Mail,
} from 'lucide-react'

import {
  verifyOtp,
  resendVerificationOtp,
} from '../../services/api/verificationApi'

interface LocationState {
  userId?: string
  email?: string
  invitationToken?: string
}

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const state =
    (location.state as LocationState | null) ?? {}

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCooldown, setResendCooldown] =
    useState(0)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')
    setMessage('')

    if (!state.userId) {
      setError(
        'Registration session is missing. Please sign up again.',
      )
      return
    }

    if (!/^\d{6}$/.test(otp)) {
      setError(
        'Please enter the 6-digit OTP.',
      )
      return
    }

    setLoading(true)

    try {
      const response = await verifyOtp({
        userId: state.userId,
        channel: 'EMAIL',
        otp,
      })

      if (response.accountActive) {
        navigate('/login', {
          replace: true,
          state: {
            message:
              'Account verified successfully. You can now log in.',
            invitationToken:
              state.invitationToken,
          },
        })

        return
      }

      setMessage(
        'Email verified successfully. You can now log in.',
      )

      setOtp('')
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Invalid or expired OTP. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError('')
    setMessage('')

    if (!state.userId) {
      setError(
        'Registration session is missing. Please sign up again.',
      )
      return
    }

    if (
      resendCooldown > 0 ||
      resending
    ) {
      return
    }

    setResending(true)

    try {
      await resendVerificationOtp(
        state.userId,
      )

      setOtp('')

      setMessage(
        'A new verification code has been sent to your email.',
      )

      setResendCooldown(60)

      const interval =
        window.setInterval(() => {
          setResendCooldown(
            (current) => {
              if (current <= 1) {
                window.clearInterval(
                  interval,
                )

                return 0
              }

              return current - 1
            },
          )
        }, 1000)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to resend the OTP. Please try again.',
      )
    } finally {
      setResending(false)
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
            Verify your email
          </h1>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            Enter the verification code we sent to
            your email address.
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

          {message && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {state.invitationToken && (
            <div className="mb-5 rounded-xl border border-[var(--color-teal-200)] bg-[var(--color-teal-50)] px-4 py-3 text-sm text-[var(--color-teal-800)]">
              Your resident invitation will be
              connected after your email is verified.
            </div>
          )}

          <div className="mb-6 flex items-center gap-3 rounded-xl bg-[var(--color-ivory-100)] px-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <Mail className="h-5 w-5 text-[var(--color-forest-900)]" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-[var(--color-ink-500)]">
                Verification code sent to
              </p>

              <p className="truncate text-sm font-semibold text-[var(--color-ink-900)]">
                {state.email ||
                  'your email address'}
              </p>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-[var(--color-ink-700)]">
              Enter 6-digit OTP
            </span>

            <input
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(
                  event.target.value.replace(
                    /\D/g,
                    '',
                  ),
                )
              }
              placeholder="123456"
              className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-center text-xl tracking-[0.4em] outline-none focus:border-[var(--color-forest-900)]"
            />
          </label>

          <button
            type="submit"
            disabled={
              loading ||
              otp.length !== 6
            }
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-forest-900)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--color-forest-800)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify Email
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={
              resending ||
              resendCooldown > 0
            }
            className="mt-4 w-full text-sm font-semibold text-[var(--color-forest-900)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resending
              ? 'Sending new code...'
              : resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : 'Resend OTP'}
          </button>

          <p className="mt-6 text-center text-sm text-[var(--color-ink-500)]">
            Need to start again?{' '}
            <Link
              to={
                state.invitationToken
                  ? `/signup?invitationToken=${encodeURIComponent(
                      state.invitationToken,
                    )}&email=${encodeURIComponent(
                      state.email || '',
                    )}`
                  : '/signup'
              }
              className="font-semibold text-[var(--color-forest-900)]"
            >
              Sign up again
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}