import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  getMySocieties,
  type MySocietyResponse,
} from '../../services/api/societyApi'
import {
  Building2,
  ChevronRight,
  LogOut,
  Settings,
  User,
} from 'lucide-react'

import { useAuth } from '../../components/auth/AuthProvider'
import { logout } from '../../services/api/authApi'

export default function AccountHomePage() {
  const { user, clearAuth } = useAuth()

  const [societies, setSocieties] =
    useState<MySocietyResponse[]>([])

  const [societiesLoading, setSocietiesLoading] =
    useState(true)

  const [societiesError, setSocietiesError] =
    useState('')

  const firstName = user?.firstName || 'there'
  async function handleLogout() {
    const refreshToken =
      localStorage.getItem('societyos_refresh_token')

    try {
      if (refreshToken) {
        await logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      localStorage.removeItem('societyos_access_token')
      localStorage.removeItem('societyos_refresh_token')
      localStorage.removeItem('societyos_user_id')
      localStorage.removeItem('societyos_user')

      clearAuth()

      window.location.href = '/login'
    }
  }
  useEffect(() => {
    async function loadSocieties() {
      try {
        setSocietiesLoading(true)
        setSocietiesError('')

        const result = await getMySocieties()

        setSocieties(result)
      } catch (error) {
        console.error('Failed to load societies:', error)
        setSocietiesError(
          'Unable to load your societies right now.',
        )
      } finally {
        setSocietiesLoading(false)
      }
    }

    loadSocieties()
  }, [])

  return (
    <main className="min-h-screen bg-[var(--color-ivory-100)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/account"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-forest-900)] font-bold text-white">
              S
            </div>

            <div>
              <p className="font-bold text-[var(--color-ink-950)]">
                SocietyOS
              </p>

              <p className="text-[10px] tracking-[0.15em] text-[var(--color-ink-400)]">
                COMMUNITY PLATFORM
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/account/profile"
              className="rounded-xl p-2 text-[var(--color-ink-500)] transition hover:bg-[var(--color-ivory-100)]"
              title="Profile"
            >
              <User className="h-5 w-5" />
            </Link>

            <Link
              to="/account/settings"
              className="rounded-xl p-2 text-[var(--color-ink-500)] transition hover:bg-[var(--color-ivory-100)]"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-600)]">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink-950)] sm:text-4xl">
            Welcome back, {firstName} 👋
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-ink-500)]">
            Manage your SocietyOS account and access the societies
            you belong to.
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-ink-950)]">
                My Societies
              </h2>

              <p className="mt-1 text-sm text-[var(--color-ink-500)]">
                Your societies will appear here.
              </p>
            </div>
          </div>

          {societiesLoading ? (
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
                <Building2 className="h-7 w-7" />
              </div>

              <p className="mt-5 text-sm text-[var(--color-ink-500)]">
                Loading your societies...
              </p>
            </div>
          ) : societiesError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-sm font-medium text-red-700">
                {societiesError}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-[var(--color-forest-900)] px-4 py-2 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : societies.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[var(--color-border)] bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
                <Building2 className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[var(--color-ink-950)]">
                No societies connected yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-ink-500)]">
                Create a society or join an existing society to start
                using SocietyOS.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/account/societies/new"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-forest-900)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <Building2 className="h-4 w-4" />
                  Create Society
                </Link>

                <Link
                  to="/account/join"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink-800)] transition hover:bg-[var(--color-ivory-100)]"
                >
                  Join Society
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {societies.map((society) => (
                <div
                  key={society.societyId}
                  className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
                        <Building2 className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-[var(--color-ink-950)]">
                          {society.societyName}
                        </h3>

                        <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                          {society.position.replaceAll('_', ' ')}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-[var(--color-teal-50)] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-teal-700)]">
                      {society.societyStatus.replaceAll('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[var(--color-ivory-100)] p-3">
                      <p className="text-[10px] uppercase tracking-wide text-[var(--color-ink-400)]">
                        Role
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[var(--color-ink-900)]">
                        {society.role.replaceAll('_', ' ')}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[var(--color-ivory-100)] p-3">
                      <p className="text-[10px] uppercase tracking-wide text-[var(--color-ink-400)]">
                        Membership
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[var(--color-ink-900)]">
                        {society.membershipStatus.replaceAll('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={
                      society.role === 'SOCIETY_ADMIN'
                        ? `/admin?societyId=${society.societyId}`
                        : `/app/dashboard?societyId=${society.societyId}`
                    }
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-forest-900)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Open Society
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <Link
            to="/account/profile"
            className="group rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <User className="h-6 w-6 text-[var(--color-teal-600)]" />

            <h3 className="mt-5 font-semibold text-[var(--color-ink-950)]">
              My Profile
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
              View and update your personal account information.
            </p>
          </Link>

          <Link
            to="/account/settings"
            className="group rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Settings className="h-6 w-6 text-[var(--color-teal-600)]" />

            <h3 className="mt-5 font-semibold text-[var(--color-ink-950)]">
              Settings
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
              Manage your account preferences and notifications.
            </p>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-3xl border border-[var(--color-border)] bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <LogOut className="h-6 w-6 text-[var(--color-teal-600)]" />

            <h3 className="mt-5 font-semibold text-[var(--color-ink-950)]">
              Log out
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
              Sign out of your SocietyOS account.
            </p>
          </button>
        </section>
      </div>
    </main>
  )
}