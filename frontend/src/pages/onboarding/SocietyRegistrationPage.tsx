import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSociety } from '../../services/api/societyApi'

export default function SocietyRegistrationPage() {
  const navigate = useNavigate()

type ClaimedPosition =
  | 'OWNER'
  | 'SECRETARY'
  | 'AUTHORIZED_REPRESENTATIVE'

const [form, setForm] = useState<{
  name: string
  addressLine: string
  city: string
  state: string
  pinCode: string
  buildingCount: number
  unitCount: number
  claimedPosition: ClaimedPosition
}>({
  name: '',
  addressLine: '',
  city: '',
  state: '',
  pinCode: '',
  buildingCount: 1,
  unitCount: 1,
  claimedPosition: 'OWNER',
})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateField(
    field: string,
    value: string | number
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await createSociety(form)

      navigate('/onboarding/society/verification', {
        state: {
          societyId: response.societyId,
          verificationId: response.verificationId,
        },
      })
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        'Unable to create society. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-ivory-100)] px-5 py-10">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">
          <p className="text-sm font-semibold text-[var(--color-forest-900)]">
            Society onboarding
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--color-ink-950)]">
            Register your society
          </h1>

          <p className="mt-2 text-[var(--color-ink-500)]">
            Tell us about your society. You can complete verification after
            registration.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
        >

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Society name
              </label>

              <input
                required
                value={form.name}
                onChange={(e) =>
                  updateField('name', e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3"
                placeholder="e.g. Green Valley Residency"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Address
              </label>

              <input
                required
                value={form.addressLine}
                onChange={(e) =>
                  updateField('addressLine', e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3"
                placeholder="Society address"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  City
                </label>

                <input
                  required
                  value={form.city}
                  onChange={(e) =>
                    updateField('city', e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  State
                </label>

                <input
                  required
                  value={form.state}
                  onChange={(e) =>
                    updateField('state', e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  PIN code
                </label>

                <input
                  required
                  maxLength={6}
                  value={form.pinCode}
                  onChange={(e) =>
                    updateField('pinCode', e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="400001"
                />
              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Number of buildings
                </label>

                <input
                  required
                  type="number"
                  min={1}
                  value={form.buildingCount}
                  onChange={(e) =>
                    updateField(
                      'buildingCount',
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Total number of units
                </label>

                <input
                  required
                  type="number"
                  min={1}
                  value={form.unitCount}
                  onChange={(e) =>
                    updateField(
                      'unitCount',
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Your position
              </label>

              <select
                value={form.claimedPosition}
                onChange={(e) =>
                  updateField(
                    'claimedPosition',
                    e.target.value as ClaimedPosition
                  )
                }
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="OWNER">
                  Owner
                </option>

                <option value="SECRETARY">
                  Secretary
                </option>

                <option value="AUTHORIZED_REPRESENTATIVE">
                  Authorized Representative
                </option>
              </select>
            </div>

          </div>

          <div className="mt-8 flex justify-end">

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[var(--color-forest-900)] px-6 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading
                ? 'Creating society...'
                : 'Continue'}
            </button>

          </div>

        </form>
      </div>
    </main>
  )
}