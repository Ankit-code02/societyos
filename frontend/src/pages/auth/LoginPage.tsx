import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { login } from '../../services/api/authApi'
import { useAuth } from '../../components/auth/AuthProvider'
import { acceptResidentInvitation } from '../../services/api/residentInvitationApi'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),

  password: z
    .string()
    .min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, loading, refreshAuth } = useAuth()

  const [searchParams] = useSearchParams()

  const invitationToken =
    searchParams.get('invitationToken')

    useEffect(() => {
      if (loading) {
        return
      }

      if (user && !invitationToken) {
        navigate('/account', {
          replace: true,
        })
      }
    }, [loading, user, invitationToken, navigate])

  const [serverError, setServerError] = useState('')
  const [invitationMessage, setInvitationMessage] =
    useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError('')
    setInvitationMessage('')

    try {
      const response = await login(data)

      localStorage.setItem(
        'societyos_access_token',
        response.accessToken,
      )

      localStorage.setItem(
        'societyos_refresh_token',
        response.refreshToken,
      )

      localStorage.setItem(
        'societyos_user_id',
        response.userId,
      )

      /*
       * Normal login:
       * After authentication, every user goes to
       * their account home first.
       *
       * The account home will later show:
       * - My profile
       * - My societies
       * - Create/manage society
       * - Join society
       * - Settings
       * - Logout
       */
      if (!invitationToken) {
        const authContext = await refreshAuth()

        if (!authContext) {
          setServerError(
            'Login succeeded, but we could not load your account. Please try again.',
          )
          return
        }

        navigate('/account', {
          replace: true,
        })

        return
      }

      /*
       * Invitation login:
       * The user is authenticated now, so we can
       * accept the resident invitation.
       */
      try {
        await acceptResidentInvitation({
          token: invitationToken,
        })

        await refreshAuth()

        navigate('/app/dashboard', {
          replace: true,
        })
      } catch (error: any) {
        /*
         * Authentication succeeded, but invitation
         * acceptance failed.
         *
         * We do NOT log the user out because their
         * account itself is valid.
         */
        setServerError(
          error?.response?.data?.message ||
            'You are logged in, but we could not accept the invitation. Please try the invitation link again.',
        )
      }
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ||
          'Unable to log in. Please check your email and password.',
      )
    }
  }
if (loading) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-ivory-100)]">
      <p className="text-sm text-[var(--color-ink-500)]">
        Checking your session...
      </p>
    </main>
  )
}

  return (
    <main className="min-h-screen bg-[var(--color-ivory-100)] px-6 py-10 sm:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">

          {/* Brand panel */}
          <div className="hidden bg-[var(--color-forest-900)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 font-bold">
                  S
                </div>

                <div>
                  <p className="font-bold">
                    SocietyOS
                  </p>

                  <p className="text-[10px] tracking-[0.15em] text-white/60">
                    COMMUNITY PLATFORM
                  </p>
                </div>
              </Link>

              <div className="mt-20 max-w-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-teal-200)]">
                  Welcome back
                </p>

                <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em]">
                  Your community,
                  <br />
                  all in one place.
                </h1>

                <p className="mt-6 text-sm leading-7 text-white/65">
                  Stay connected with your society, keep track of everyday
                  operations, and get help when you need it.
                </p>
              </div>
            </div>

            <p className="text-xs text-white/40">
              Built for connected communities.
            </p>
          </div>

          {/* Login panel */}
          <div className="p-7 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">

              {/* Mobile logo */}
              <Link
                to="/"
                className="mb-10 flex items-center justify-center gap-3 lg:hidden"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-forest-900)] font-bold text-white">
                  S
                </div>

                <div>
                  <p className="text-sm font-bold">
                    SocietyOS
                  </p>

                  <p className="text-[10px] tracking-[0.12em] text-[var(--color-ink-500)]">
                    COMMUNITY PLATFORM
                  </p>
                </div>
              </Link>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
                  {invitationToken
                    ? 'Join your society'
                    : 'Sign in'}
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink-950)]">
                  {invitationToken
                    ? 'Complete your invitation.'
                    : 'Welcome back.'}
                </h2>

                <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
                  {invitationToken
                    ? 'Log in to accept your resident invitation.'
                    : 'Log in to access your SocietyOS account.'}
                </p>
              </div>

              {serverError && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {serverError}
                </div>
              )}

              {invitationMessage && (
                <div
                  role="status"
                  className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                  {invitationMessage}
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
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
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory-50)] px-4 text-sm text-[var(--color-ink-950)] outline-none transition placeholder:text-[var(--color-ink-400)] focus:border-[var(--color-teal-500)] focus:ring-4 focus:ring-[var(--color-teal-500)]/10"
                  />

                  {errors.email && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-[var(--color-ink-800)]"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-[var(--color-teal-600)] hover:text-[var(--color-forest-900)]"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register('password')}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory-50)] px-4 text-sm text-[var(--color-ink-950)] outline-none transition placeholder:text-[var(--color-ink-400)] focus:border-[var(--color-teal-500)] focus:ring-4 focus:ring-[var(--color-teal-500)]/10"
                  />

                  {errors.password && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl bg-[var(--color-forest-900)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-forest-800)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? invitationToken
                      ? 'Joining society...'
                      : 'Signing in...'
                    : invitationToken
                      ? 'Log in & Join Society'
                      : 'Log in'}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-[var(--color-border)]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink-400)]">
                  SocietyOS
                </span>

                <div className="h-px flex-1 bg-[var(--color-border)]" />
              </div>

              <p className="text-center text-sm text-[var(--color-ink-500)]">
                Don't have an account?{' '}

                <Link
                  to={
                    invitationToken
                      ? `/signup?invitationToken=${encodeURIComponent(
                          invitationToken,
                        )}`
                      : '/signup'
                  }
                  className="font-semibold text-[var(--color-teal-600)] hover:text-[var(--color-forest-900)]"
                >
                  Create an account
                </Link>
              </p>

              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="text-xs font-medium text-[var(--color-ink-400)] hover:text-[var(--color-ink-700)]"
                >
                  ← Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}