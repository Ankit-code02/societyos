import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, User } from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'

export default function AccountProfilePage() {
  const { user } = useAuth()

  const fullName =
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ||
    'User'

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
            My Profile
          </h1>

          <p className="mt-2 text-sm text-[var(--color-ink-500)]">
            View your SocietyOS account information.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4 border-b border-[var(--color-border)] pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-forest-900)] text-xl font-bold text-white">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--color-ink-950)]">
                {fullName}
              </h2>

              <p className="mt-1 text-sm text-[var(--color-ink-500)]">
                SocietyOS account
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[var(--color-ivory-100)] p-5">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-[var(--color-teal-600)]" />

                <div>
                  <p className="text-xs text-[var(--color-ink-400)]">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[var(--color-ink-900)]">
                    {fullName}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--color-ivory-100)] p-5">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[var(--color-teal-600)]" />

                <div>
                  <p className="text-xs text-[var(--color-ink-400)]">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-[var(--color-ink-900)]">
                    {user?.email ?? 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}