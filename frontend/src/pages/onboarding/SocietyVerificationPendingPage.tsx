import { useLocation, useNavigate } from 'react-router-dom'

export default function SocietyVerificationPendingPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const { societyId } = location.state || {}

  return (
    <main className="min-h-screen bg-[var(--color-ivory-100)] px-5 py-12">
      <div className="mx-auto max-w-2xl">

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-ivory-100)] text-3xl">
            ✓
          </div>

          <p className="mt-6 text-sm font-semibold text-[var(--color-forest-900)]">
            Verification submitted
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--color-ink-950)]">
            Your society is under review
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-[var(--color-ink-500)]">
            We've received your society verification request.
            Once the society is approved, your admin dashboard
            will become available.
          </p>

          <div className="mt-8 rounded-xl bg-[var(--color-ivory-100)] p-5 text-left">
            <p className="text-sm font-semibold text-[var(--color-ink-950)]">
              Current status
            </p>

            <p className="mt-2 text-sm text-[var(--color-ink-500)]">
              Pending verification
            </p>

            {societyId && (
              <p className="mt-3 break-all text-xs text-[var(--color-ink-500)]">
                Society ID: {societyId}
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-lg border border-[var(--color-border)] px-5 py-3 font-semibold text-[var(--color-ink-950)]"
            >
              Back to Home
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-lg bg-[var(--color-forest-900)] px-5 py-3 font-semibold text-white"
            >
              Go to Login
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}