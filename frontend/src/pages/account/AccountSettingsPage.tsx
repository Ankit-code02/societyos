import { Link } from 'react-router-dom'
import { ArrowLeft, Lock, User } from 'lucide-react'

export default function AccountSettingsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-ivory-100)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-4xl items-center px-6 py-4">
          <Link
            to="/account"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--color-ink-700)] hover:bg-[var(--color-ivory-100)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Account
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-600)]">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-[var(--color-ink-950)]">
            Account Settings
          </h1>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            Manage your SocietyOS account preferences and security.
          </p>
        </div>

        <div className="grid gap-5">
          <Link
            to="/account/profile"
            className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-ivory-100)]">
                <User className="h-5 w-5 text-[var(--color-teal-600)]" />
              </div>

              <div>
                <h2 className="font-semibold text-[var(--color-ink-950)]">
                  Profile
                </h2>

                <p className="mt-1 text-sm text-[var(--color-ink-500)]">
                  View and manage your account information.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/forgot-password"
            className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-ivory-100)]">
                <Lock className="h-5 w-5 text-[var(--color-teal-600)]" />
              </div>

              <div>
                <h2 className="font-semibold text-[var(--color-ink-950)]">
                  Password & Security
                </h2>

                <p className="mt-1 text-sm text-[var(--color-ink-500)]">
                  Change or recover your account password.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
