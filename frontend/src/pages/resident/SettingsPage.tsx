import { useEffect, useState } from 'react'
import { useAuth } from '../../components/auth/AuthProvider'
import { useQuery } from '@tanstack/react-query'
import {
  getCurrentUser,
  updateCurrentUser,
} from '../../services/api/userApi'
import { logout as logoutApi } from '../../services/api/authApi'
import {
  Bell,
  Check,
  LogOut,
  Monitor,
  Moon,
  Shield,
  Sun,
  User,
} from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'

interface NotificationPreferences {
  meetings: boolean
  complaints: boolean
  announcements: boolean
}

const NOTIFICATION_KEY = 'societyos_notification_preferences'
const THEME_KEY = 'societyos_theme'

const defaultNotifications: NotificationPreferences = {
  meetings: true,
  complaints: true,
  announcements: true,
}

function getStoredNotifications(): NotificationPreferences {
  try {
    const stored = localStorage.getItem(NOTIFICATION_KEY)

    if (!stored) {
      return defaultNotifications
    }

    return {
      ...defaultNotifications,
      ...JSON.parse(stored),
    }
  } catch {
    return defaultNotifications
  }
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY)

  if (
    stored === 'light' ||
    stored === 'dark' ||
    stored === 'system'
  ) {
    return stored
  }

  return 'system'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement

  if (theme === 'system') {
    root.removeAttribute('data-theme')
    return
  }

  root.setAttribute('data-theme', theme)
}

export default function SettingsPage() {
    const { clearAuth } = useAuth()

  const [theme, setTheme] = useState<Theme>(getStoredTheme)
  const [notifications, setNotifications] =
    useState<NotificationPreferences>(
      getStoredNotifications,
    )

  const userQuery = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
  })

  const account = userQuery.data
  const [editingProfile, setEditingProfile] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  useEffect(() => {
    if (!account) return

    setFirstName(account.firstName)
    setLastName(account.lastName)
    setPhone(account.phone)
  }, [account])

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(
      NOTIFICATION_KEY,
      JSON.stringify(notifications),
    )
  }, [notifications])

  function updateNotification(
    key: keyof NotificationPreferences,
  ) {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  async function logout() {
    const refreshToken = localStorage.getItem(
      'societyos_refresh_token',
    )

    try {
      if (refreshToken) {
        await logoutApi(refreshToken)
      }
    } catch {
      // Even if the server request fails,
      // clear the local session.
    } finally {
      localStorage.removeItem('societyos_access_token')
      localStorage.removeItem('societyos_refresh_token')
      localStorage.removeItem('societyos_user_id')
      localStorage.removeItem('societyos_user')

      clearAuth()

      window.location.href = '/login'
    }
  }
async function saveProfile() {
  setProfileError('')
  setProfileSuccess('')

  if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
    setProfileError('First name, last name and phone are required.')
    return
  }

  setProfileSaving(true)

  try {
    await updateCurrentUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
    })

    await userQuery.refetch()

    setEditingProfile(false)
    setProfileSuccess('Profile updated successfully.')
  } catch (error: any) {
    setProfileError(
      error?.response?.data?.message ||
        'Unable to update your profile.',
    )
  } finally {
    setProfileSaving(false)
  }
}

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-600)]">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink-950)] sm:text-4xl">
          Settings
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-ink-500)]">
          Manage your account preferences and SocietyOS experience.
        </p>
      </section>

      {/* Account */}
      <section className="rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="border-b border-[var(--color-border)] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
              <User className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-[var(--color-ink-950)]">
                Account information
              </h2>

              <p className="mt-0.5 text-xs text-[var(--color-ink-400)]">
                Your current account details
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {profileError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {profileError}
            </div>
          )}

          {profileSuccess && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {profileSuccess}
            </div>
          )}

          {!editingProfile ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-[var(--color-ink-400)]">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-[var(--color-ink-800)]">
                    {userQuery.isLoading
                      ? 'Loading...'
                      : account
                        ? `${account.firstName} ${account.lastName}`
                        : 'Not available'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[var(--color-ink-400)]">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-[var(--color-ink-800)]">
                    {userQuery.isLoading
                      ? 'Loading...'
                      : account?.email || 'Not available'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[var(--color-ink-400)]">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium text-[var(--color-ink-800)]">
                    {userQuery.isLoading
                      ? 'Loading...'
                      : account?.phone || 'Not available'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[var(--color-ink-400)]">
                    Account status
                  </p>

                  <p className="mt-1 text-sm font-medium capitalize text-[var(--color-ink-800)]">
                    {userQuery.isLoading
                      ? 'Loading...'
                      : account?.status
                        ? account.status
                            .toLowerCase()
                            .replaceAll('_', ' ')
                        : 'Not available'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileError('')
                  setProfileSuccess('')
                  setEditingProfile(true)
                }}
                className="mt-6 rounded-xl bg-[var(--color-forest-900)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-forest-800)]"
              >
                Edit profile
              </button>
            </>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-[var(--color-ink-500)]">
                    First name
                  </label>

                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 text-sm outline-none focus:border-[var(--color-teal-500)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-ink-500)]">
                    Last name
                  </label>

                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 text-sm outline-none focus:border-[var(--color-teal-500)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-ink-500)]">
                  Phone
                </label>

                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+919876543210"
                  className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 text-sm outline-none focus:border-[var(--color-teal-500)]"
                />
              </div>

              <div>
                <p className="text-xs text-[var(--color-ink-400)]">
                  Email changes require a separate verification flow and are not
                  editable here.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(false)
                    setProfileError('')
                  }}
                  disabled={profileSaving}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink-700)]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={profileSaving}
                  className="rounded-xl bg-[var(--color-forest-900)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {profileSaving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Appearance */}
      <section className="rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="border-b border-[var(--color-border)] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
              <Monitor className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-[var(--color-ink-950)]">
                Appearance
              </h2>

              <p className="mt-0.5 text-xs text-[var(--color-ink-400)]">
                Choose how SocietyOS looks on your device
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-3">
          {[
            {
              value: 'light' as const,
              label: 'Light',
              icon: Sun,
            },
            {
              value: 'system' as const,
              label: 'System',
              icon: Monitor,
            },
            {
              value: 'dark' as const,
              label: 'Dark',
              icon: Moon,
            },
          ].map((option) => {
            const Icon = option.icon
            const selected = theme === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={`relative flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  selected
                    ? 'border-[var(--color-forest-900)] bg-[var(--color-ivory-100)]'
                    : 'border-[var(--color-border)] hover:bg-[var(--color-ivory-100)]'
                }`}
              >
                <Icon className="h-5 w-5 text-[var(--color-ink-600)]" />

                <span className="text-sm font-semibold text-[var(--color-ink-800)]">
                  {option.label}
                </span>

                {selected && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-forest-900)] text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="px-6 pb-6">
          <p className="text-xs leading-5 text-[var(--color-ink-400)]">
            Theme preferences are stored locally on this device.
          </p>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="border-b border-[var(--color-border)] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
              <Bell className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-[var(--color-ink-950)]">
                Notifications
              </h2>

              <p className="mt-0.5 text-xs text-[var(--color-ink-400)]">
                Control which updates you want to receive
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {[
            {
              key: 'meetings' as const,
              title: 'Meeting reminders',
              description:
                'Updates about upcoming society meetings.',
            },
            {
              key: 'complaints' as const,
              title: 'Complaint updates',
              description:
                'Updates when the status of your complaints changes.',
            },
            {
              key: 'announcements' as const,
              title: 'Community announcements',
              description:
                'Important updates published by your society.',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-5 p-6"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--color-ink-800)]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--color-ink-400)]">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateNotification(item.key)}
                aria-pressed={notifications[item.key]}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  notifications[item.key]
                    ? 'bg-[var(--color-forest-900)]'
                    : 'bg-[var(--color-ink-300)]'
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    notifications[item.key]
                      ? 'left-6'
                      : 'left-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 border-t border-[var(--color-border)] bg-[var(--color-ivory-100)] p-5">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ink-400)]" />

          <p className="text-xs leading-5 text-[var(--color-ink-400)]">
            These preferences are stored locally on this device.
            Notification delivery is managed by SocietyOS.
          </p>
        </div>
      </section>

      {/* Security */}
      <section className="rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-[var(--color-ink-950)]">
                Security
              </h2>

              <p className="mt-1 text-xs leading-5 text-[var(--color-ink-400)]">
                Password and account security controls will be
                available when the corresponding backend APIs are
                added.
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}