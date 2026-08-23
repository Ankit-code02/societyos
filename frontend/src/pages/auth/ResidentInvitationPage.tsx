import { useEffect, useState } from 'react'
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MapPin,
} from 'lucide-react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import {
  getResidentInvitationPreview,
  type ResidentInvitationPreviewResponse,
} from '../../services/api/residentInvitationApi'

export default function ResidentInvitationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')

  const [invitation, setInvitation] =
    useState<ResidentInvitationPreviewResponse | null>(
      null,
    )

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError(
        'This invitation link is missing its invitation token.',
      )
      setLoading(false)
      return
    }

    async function loadInvitation() {
      if (!token) {
        return
      }

      try {
        setLoading(true)
        setError('')

        const data =
          await getResidentInvitationPreview(
            token,
          )

        setInvitation(data)
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            'This invitation is invalid or has expired.',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadInvitation()
  }, [token])

  function handleContinue() {
    if (!token || !invitation) {
      return
    }

    /*
     * Preserve the invitation token while the
     * resident completes the existing authentication
     * flow.
     */
    navigate(
      `/signup?invitationToken=${encodeURIComponent(
        token,
      )}&email=${encodeURIComponent(
        invitation.email,
      )}`,
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-ivory-100)] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-lg items-center justify-center">
        <div className="w-full rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-sm">
          {/* Brand */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-teal-600)] text-white">
              <Building2 className="h-7 w-7" />
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
              SocietyOS
            </p>
          </div>

          {loading ? (
            <div className="py-14 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--color-teal-600)]" />

              <p className="mt-4 text-sm text-[var(--color-ink-500)]">
                Checking your invitation...
              </p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="h-7 w-7 text-red-600" />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-[var(--color-ink-950)]">
                Invitation unavailable
              </h1>

              <p className="mt-3 text-sm leading-6 text-[var(--color-ink-500)]">
                {error}
              </p>

              <Link
                to="/"
                className="mt-7 inline-flex rounded-xl bg-[var(--color-teal-600)] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Go to SocietyOS
              </Link>
            </div>
          ) : invitation ? (
            <>
              <div className="mt-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-teal-50)]">
                  <CheckCircle2 className="h-6 w-6 text-[var(--color-teal-600)]" />
                </div>

                <h1 className="mt-4 text-2xl font-bold text-[var(--color-ink-950)]">
                  You're invited
                </h1>

                <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                  You've been invited to join this
                  society on SocietyOS.
                </p>
              </div>

              {/* Society */}
              <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-ivory-100)] p-5">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-teal-600)]" />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-400)]">
                      Society
                    </p>

                    <p className="mt-1 text-lg font-semibold text-[var(--color-ink-900)]">
                      {invitation.societyName}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-teal-600)]" />

                    <div>
                      <p className="text-xs text-[var(--color-ink-400)]">
                        Unit
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[var(--color-ink-800)]">
                        {invitation.unitNumber}
                      </p>

                      <p className="mt-0.5 text-xs text-[var(--color-ink-500)]">
                        Floor {invitation.floorNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-teal-600)]" />

                    <div>
                      <p className="text-xs text-[var(--color-ink-400)]">
                        Invited email
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-[var(--color-ink-800)]">
                        {invitation.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expiry */}
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />

                <p className="text-xs leading-5 text-amber-800">
                  This invitation expires on{' '}
                  <strong>
                    {new Date(
                      invitation.expiresAt,
                    ).toLocaleString()}
                  </strong>
                  .
                </p>
              </div>

              {/* Continue */}
              <button
                type="button"
                onClick={handleContinue}
                className="mt-7 w-full rounded-xl bg-[var(--color-teal-600)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Continue to Account Setup
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-[var(--color-ink-400)]">
                Your invitation email must match the
                email address used for your SocietyOS
                account.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}