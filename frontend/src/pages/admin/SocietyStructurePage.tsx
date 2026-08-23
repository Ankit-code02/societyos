import { useEffect, useState } from 'react'
import {
  Building2,
  Plus,
  Home,
  ChevronDown,
} from 'lucide-react'
import { useSocietyId } from '../../hooks/useSocietyId'
import {
  createBuilding,
  createUnit,
  getBuildings,
  getUnits,
} from '../../services/api/societyApi'

import type {
  Building,
  Unit,
} from '../../types/society'

export default function SocietyStructurePage() {
  const societyId = useSocietyId()

  const [buildings, setBuildings] = useState<Building[]>([])
  const [units, setUnits] = useState<Unit[]>([])

  const [selectedBuildingId, setSelectedBuildingId] =
    useState<string>('')

  const [loading, setLoading] = useState(true)
  const [savingBuilding, setSavingBuilding] =
    useState(false)
  const [savingUnit, setSavingUnit] = useState(false)
  const [error, setError] = useState('')

  const [showBuildingForm, setShowBuildingForm] =
    useState(false)
  const [showUnitForm, setShowUnitForm] =
    useState(false)

  const [buildingForm, setBuildingForm] = useState({
    name: '',
    code: '',
    floorCount: '',
    unitCount: '',
  })

  const [unitForm, setUnitForm] = useState({
    unitNumber: '',
    floorNumber: '',
    unitType: 'APARTMENT',
  })

  async function loadBuildings() {
    if (!societyId) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await getBuildings(societyId)

      setBuildings(data)

      if (data.length > 0) {
        setSelectedBuildingId((current) =>
          current && data.some(
            (building) => building.id === current,
          )
            ? current
            : data[0].id,
        )
      } else {
        setSelectedBuildingId('')
        setUnits([])
      }
    } catch {
      setError('Unable to load buildings.')
    } finally {
      setLoading(false)
    }
  }

  async function loadUnits(buildingId: string) {
    if (!societyId) {
      return
    }

    try {
      setError('')

      const data = await getUnits(
        societyId,
        buildingId,
      )

      setUnits(data)
    } catch {
      setError('Unable to load units.')
    }
  }

  useEffect(() => {
    void loadBuildings()
  }, [societyId])

  useEffect(() => {
    if (selectedBuildingId) {
      void loadUnits(selectedBuildingId)
    } else {
      setUnits([])
    }
  }, [selectedBuildingId, societyId])

  async function handleCreateBuilding(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!societyId) {
      return
    }

    const floorCount = Number(
      buildingForm.floorCount,
    )

    const unitCount = Number(
      buildingForm.unitCount,
    )

    if (floorCount < 1 || unitCount < 1) {
      setError(
        'Floor count and unit count must be at least 1.',
      )
      return
    }

    try {
      setSavingBuilding(true)
      setError('')

      const building = await createBuilding(
        societyId,
        {
          name: buildingForm.name.trim(),
          code: buildingForm.code.trim(),
          floorCount,
          unitCount,
        },
      )

      setBuildingForm({
        name: '',
        code: '',
        floorCount: '',
        unitCount: '',
      })

      setShowBuildingForm(false)

      await loadBuildings()

      setSelectedBuildingId(building.id)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to create building.',
      )
    } finally {
      setSavingBuilding(false)
    }
  }

  async function handleCreateUnit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!societyId || !selectedBuildingId) {
      return
    }

    const floorNumber = Number(
      unitForm.floorNumber,
    )

    if (floorNumber < 0) {
      setError(
        'Floor number cannot be negative.',
      )
      return
    }

    try {
      setSavingUnit(true)
      setError('')

      await createUnit(
        societyId,
        selectedBuildingId,
        {
          unitNumber:
            unitForm.unitNumber.trim(),
          floorNumber,
          unitType: unitForm.unitType,
          status: 'AVAILABLE',
        },
      )

      setUnitForm({
        unitNumber: '',
        floorNumber: '',
        unitType: 'APARTMENT',
      })

      setShowUnitForm(false)

      await loadUnits(selectedBuildingId)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to create unit.',
      )
    } finally {
      setSavingUnit(false)
    }
  }

  const selectedBuilding = buildings.find(
    (building) =>
      building.id === selectedBuildingId,
  )

  if (!societyId) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <p className="text-sm text-[var(--color-ink-500)]">
            No society is associated with this account.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-teal-600)] text-white">
            <Building2 className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
              Society Setup
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[var(--color-ink-950)]">
              Buildings & Units
            </h1>

            <p className="mt-2 text-sm text-[var(--color-ink-500)]">
              Set up the buildings and flats in your society.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowBuildingForm(!showBuildingForm)
          }
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-600)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Building
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {showBuildingForm && (
        <form
          onSubmit={handleCreateBuilding}
          className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-6"
        >
          <h2 className="text-lg font-semibold text-[var(--color-ink-900)]">
            Add Building
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Building name"
              value={buildingForm.name}
              onChange={(event) =>
                setBuildingForm({
                  ...buildingForm,
                  name: event.target.value,
                })
              }
              className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)]"
            />

            <input
              required
              placeholder="Building code"
              value={buildingForm.code}
              onChange={(event) =>
                setBuildingForm({
                  ...buildingForm,
                  code: event.target.value,
                })
              }
              className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)]"
            />

            <input
              required
              min="1"
              type="number"
              placeholder="Number of floors"
              value={buildingForm.floorCount}
              onChange={(event) =>
                setBuildingForm({
                  ...buildingForm,
                  floorCount: event.target.value,
                })
              }
              className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)]"
            />

            <input
              required
              min="1"
              type="number"
              placeholder="Number of units"
              value={buildingForm.unitCount}
              onChange={(event) =>
                setBuildingForm({
                  ...buildingForm,
                  unitCount: event.target.value,
                })
              }
              className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)]"
            />
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                setShowBuildingForm(false)
              }
              className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={savingBuilding}
              className="rounded-xl bg-[var(--color-teal-600)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {savingBuilding
                ? 'Creating...'
                : 'Create Building'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
          <h2 className="px-2 text-sm font-semibold text-[var(--color-ink-900)]">
            Buildings
          </h2>

          {loading ? (
            <p className="px-2 py-6 text-sm text-[var(--color-ink-500)]">
              Loading...
            </p>
          ) : buildings.length === 0 ? (
            <p className="px-2 py-6 text-sm text-[var(--color-ink-500)]">
              No buildings added yet.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {buildings.map((building) => (
                <button
                  key={building.id}
                  type="button"
                  onClick={() =>
                    setSelectedBuildingId(
                      building.id,
                    )
                  }
                  className={`w-full rounded-xl px-3 py-3 text-left transition ${
                    selectedBuildingId === building.id
                      ? 'bg-[var(--color-ivory-100)]'
                      : 'hover:bg-[var(--color-ivory-100)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-ink-900)]">
                        {building.name}
                      </p>

                      <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                        {building.code}
                      </p>
                    </div>

                    <ChevronDown className="h-4 w-4 text-[var(--color-ink-400)]" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          {!selectedBuilding ? (
            <div className="py-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-[var(--color-ink-300)]" />

              <p className="mt-4 text-sm text-[var(--color-ink-500)]">
                Select a building to manage its units.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-ink-900)]">
                    {selectedBuilding.name}
                  </h2>

                  <p className="mt-1 text-sm text-[var(--color-ink-500)]">
                    {selectedBuilding.code} ·{' '}
                    {selectedBuilding.floorCount} floors ·{' '}
                    {selectedBuilding.unitCount} units
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowUnitForm(!showUnitForm)
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink-800)] transition hover:bg-[var(--color-ivory-100)]"
                >
                  <Plus className="h-4 w-4" />
                  Add Unit
                </button>
              </div>

              {showUnitForm && (
                <form
                  onSubmit={handleCreateUnit}
                  className="mt-6 rounded-xl bg-[var(--color-ivory-100)] p-5"
                >
                  <div className="grid gap-4 sm:grid-cols-3">
                    <input
                      required
                      placeholder="Flat / Unit number"
                      value={unitForm.unitNumber}
                      onChange={(event) =>
                        setUnitForm({
                          ...unitForm,
                          unitNumber:
                            event.target.value,
                        })
                      }
                      className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)]"
                    />

                    <input
                      required
                      min="0"
                      type="number"
                      placeholder="Floor"
                      value={unitForm.floorNumber}
                      onChange={(event) =>
                        setUnitForm({
                          ...unitForm,
                          floorNumber:
                            event.target.value,
                        })
                      }
                      className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)]"
                    />

                    <select
                      value={unitForm.unitType}
                      onChange={(event) =>
                        setUnitForm({
                          ...unitForm,
                          unitType:
                            event.target.value,
                        })
                      }
                      className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)]"
                    >
                      <option value="APARTMENT">
                        Apartment
                      </option>
                      <option value="SHOP">
                        Shop
                      </option>
                      <option value="OFFICE">
                        Office
                      </option>
                      <option value="OTHER">
                        Other
                      </option>
                    </select>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setShowUnitForm(false)
                      }
                      className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={savingUnit}
                      className="rounded-xl bg-[var(--color-teal-600)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {savingUnit
                        ? 'Creating...'
                        : 'Create Unit'}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6">
                {units.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--color-border)] py-12 text-center">
                    <Home className="mx-auto h-8 w-8 text-[var(--color-ink-300)]" />

                    <p className="mt-3 text-sm text-[var(--color-ink-500)]">
                      No units added to this building yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {units.map((unit) => (
                      <div
                        key={unit.id}
                        className="rounded-xl border border-[var(--color-border)] p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-ivory-100)]">
                            <Home className="h-4 w-4 text-[var(--color-teal-600)]" />
                          </div>

                          <span className="text-xs font-medium text-[var(--color-ink-500)]">
                            {unit.status}
                          </span>
                        </div>

                        <p className="mt-4 font-semibold text-[var(--color-ink-900)]">
                          {unit.unitNumber}
                        </p>

                        <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                          Floor {unit.floorNumber} ·{' '}
                          {unit.unitType}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}