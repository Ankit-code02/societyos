import { useNavigate } from 'react-router-dom'

export default function OnboardingChoicePage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-[var(--color-ivory-100)] px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--color-ink-950)]">
            Welcome to SocietyOS
          </h1>

          <p className="mt-3 text-[var(--color-ink-500)]">
            How would you like to use SocietyOS?
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">

          <button
            type="button"
            onClick={() => navigate('/onboarding/society')}
            className="rounded-2xl border border-[var(--color-border)] bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl">🏢</div>

            <h2 className="mt-5 text-xl font-bold text-[var(--color-ink-950)]">
              Manage a Society
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
              I'm a society owner or secretary and want to manage my society
              using SocietyOS.
            </p>

            <span className="mt-6 inline-block font-semibold text-[var(--color-forest-900)]">
              Continue →
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/onboarding/join')}
            className="rounded-2xl border border-[var(--color-border)] bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl">🏠</div>

            <h2 className="mt-5 text-xl font-bold text-[var(--color-ink-950)]">
              Join a Society
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
              I received an invitation from my society and want to join it.
            </p>

            <span className="mt-6 inline-block font-semibold text-[var(--color-forest-900)]">
              Continue →
            </span>
          </button>

        </div>
      </div>
    </main>
  )
}