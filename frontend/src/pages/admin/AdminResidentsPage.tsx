import { useEffect, useState, type FormEvent } from 'react'
import { useSocietyId } from '../../hooks/useSocietyId'
import {
  Check,
  ClipboardList,
  ChevronDown,
  Loader2,
  Mail,
  Pencil,
  RotateCcw,
  UserPlus,
  UserX,
  Users,
  X,
} from 'lucide-react'

import {
  changeResidentUnit,
  getResidents,
  reactivateResident,
  removeResident,
  suspendResident,
  type Resident,
} from '../../services/api/residentsApi'

import {
  cancelResidentInvitation,
  createResidentInvitation,
  getResidentInvitations,
  resendResidentInvitation,
} from '../../services/api/residentInvitationApi'

import {
  getAllUnits,
  getBuildings,
  getUnits,
} from '../../services/api/societyApi'

type Building = Awaited<
  ReturnType<typeof getBuildings>
>[number]

type Unit = Awaited<
  ReturnType<typeof getUnits>
>[number]

type ResidentAction =
  | 'change-unit'
  | 'suspend'
  | 'reactivate'
  | 'remove'
  | null

type InvitationAction =
  | 'resend'
  | 'cancel'
  | null

export default function AdminResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [invitations, setInvitations] = useState<
    import('../../services/api/residentInvitationApi').ResidentInvitationResponse[]
  >([])

  const [loadingInvitations, setLoadingInvitations] =
    useState(false)

  const [invitationActionId, setInvitationActionId] =
    useState<string | null>(null)

  const [invitationAction, setInvitationAction] =
    useState<InvitationAction>(null)

  const societyId = useSocietyId()

  /*
   * Invitation form
   */
  const [showInviteForm, setShowInviteForm] =
    useState(false)

  const [buildings, setBuildings] = useState<Building[]>([])
  const [units, setUnits] = useState<Unit[]>([])

  const [selectedBuildingId, setSelectedBuildingId] =
    useState('')

  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedUnitId, setSelectedUnitId] =
    useState('')

  const [loadingStructure, setLoadingStructure] =
    useState(false)

  const [sendingInvitation, setSendingInvitation] =
    useState(false)

  /*
   * Resident management
   */
  const [actionMemberId, setActionMemberId] =
    useState<string | null>(null)

  const [actionType, setActionType] =
    useState<ResidentAction>(null)

  const [actionLoading, setActionLoading] =
    useState(false)

  const [showUnitModal, setShowUnitModal] =
    useState(false)

  const [unitModalBuildingId, setUnitModalBuildingId] =
    useState('')

  const [unitModalUnitId, setUnitModalUnitId] =
    useState('')

  const [unitModalUnits, setUnitModalUnits] =
    useState<Unit[]>([])

  /*
   * Load residents.
   */
  async function loadResidents() {
    if (!societyId) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await getResidents(societyId)

      setResidents(data)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load residents.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadResidents()
  }, [societyId])

  async function loadInvitations() {
    if (!societyId) {
      return
    }

    try {
      setLoadingInvitations(true)

      const data =
        await getResidentInvitations(societyId)

      setInvitations(data)
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load resident invitations.',
      )
    } finally {
      setLoadingInvitations(false)
    }
  }

  useEffect(() => {
    void loadInvitations()
  }, [societyId])

  /*
   * Load buildings when invitation form opens.
   */
  useEffect(() => {
    if (!showInviteForm || !societyId) {
      return
    }

    async function loadSocietyStructure() {
      if (!societyId) {
        return
      }

      try {
        setLoadingStructure(true)
        setError('')

        const currentSocietyId = societyId

        const buildingData =
          await getBuildings(currentSocietyId)

        setBuildings(buildingData)

        if (buildingData.length > 0) {
          setSelectedBuildingId(
            buildingData[0].id,
          )
        } else {
          setSelectedBuildingId('')
          setUnits([])
        }
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            'Unable to load society buildings.',
        )
      } finally {
        setLoadingStructure(false)
      }
    }

    void loadSocietyStructure()
  }, [showInviteForm, societyId])

  /*
   * Load units for invitation building.
   */
  useEffect(() => {
    if (!societyId || !selectedBuildingId) {
      setUnits([])
      setSelectedUnitId('')
      return
    }

    async function loadUnits() {
      if (!societyId) {
        return
      }

      try {
        setLoadingStructure(true)
        setError('')

        const currentSocietyId = societyId

        const data = await getAllUnits(currentSocietyId)

        const buildingUnits = data.filter(
          (unit) =>
            unit.buildingId === selectedBuildingId,
        )

        setUnits(buildingUnits)
        setSelectedUnitId('')
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            'Unable to load society units.',
        )

        setUnits([])
        setSelectedUnitId('')
      } finally {
        setLoadingStructure(false)
      }
    }

    void loadUnits()
  }, [selectedBuildingId, societyId])

  /*
   * Load buildings for change-unit modal.
   */
  async function openUnitModal(
    resident: Resident,
  ) {
    if (!societyId) {
      setError(
        'No society is associated with this account.',
      )
      return
    }

    try {
      setActionMemberId(resident.memberId)
      setActionType('change-unit')
      setShowUnitModal(true)
      setError('')
      setSuccessMessage('')
      setUnitModalBuildingId('')
      setUnitModalUnitId('')
      setUnitModalUnits([])
      setLoadingStructure(true)

      const buildingData =
        await getBuildings(societyId)

      setBuildings(buildingData)

      const currentUnit = resident.unitId

      let initialBuildingId = ''

      if (currentUnit) {
        const allUnits = await getAllUnits(societyId)

        const currentUnitData = allUnits.find(
          (unit) => unit.id === currentUnit,
        )

        if (currentUnitData) {
          initialBuildingId =
            currentUnitData.buildingId
        }
      }

      if (!initialBuildingId && buildingData.length > 0) {
        initialBuildingId = buildingData[0].id
      }

      setUnitModalBuildingId(initialBuildingId)

      if (initialBuildingId) {
        const allUnits = await getAllUnits(societyId)

        const buildingUnits = allUnits.filter(
          (unit) =>
            unit.buildingId === initialBuildingId,
        )

        setUnitModalUnits(buildingUnits)

        if (
          currentUnit &&
          buildingUnits.some(
            (unit) => unit.id === currentUnit,
          )
        ) {
          setUnitModalUnitId(currentUnit)
        }
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load society units.',
      )

      setShowUnitModal(false)
      setActionMemberId(null)
      setActionType(null)
    } finally {
      setLoadingStructure(false)
    }
  }

  /*
   * Change building inside unit modal.
   */
  async function handleUnitModalBuildingChange(
    buildingId: string,
  ) {
    setUnitModalBuildingId(buildingId)
    setUnitModalUnitId('')

    if (!societyId || !buildingId) {
      setUnitModalUnits([])
      return
    }

    try {
      setLoadingStructure(true)
      setError('')

      const data = await getAllUnits(societyId)

      setUnitModalUnits(
        data.filter(
          (unit) =>
            unit.buildingId === buildingId,
        ),
      )
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to load society units.',
      )

      setUnitModalUnits([])
    } finally {
      setLoadingStructure(false)
    }
  }

  /*
   * Confirm changing the resident's unit.
   */
  async function handleChangeUnit() {
    if (
      !societyId ||
      !actionMemberId ||
      !unitModalUnitId
    ) {
      setError('Please select a unit.')
      return
    }

    try {
      setActionLoading(true)
      setError('')
      setSuccessMessage('')

      await changeResidentUnit(
        societyId,
        actionMemberId,
        unitModalUnitId,
      )

      setSuccessMessage(
        'Resident unit updated successfully.',
      )

      closeActionModal()

      await loadResidents()
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to change resident unit.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  /*
   * Suspend resident.
   */
  async function handleSuspend(
    resident: Resident,
  ) {
    const confirmed = window.confirm(
      `Suspend ${resident.email}? They will no longer have an active resident membership.`,
    )

    if (!confirmed || !societyId) {
      return
    }

    try {
      setActionMemberId(resident.memberId)
      setActionType('suspend')
      setActionLoading(true)
      setError('')
      setSuccessMessage('')

      await suspendResident(
        societyId,
        resident.memberId,
      )

      setSuccessMessage(
        `${resident.email} has been suspended.`,
      )

      await loadResidents()
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to suspend resident.',
      )
    } finally {
      setActionLoading(false)
      setActionMemberId(null)
      setActionType(null)
    }
  }

  /*
   * Reactivate resident.
   */
  async function handleReactivate(
    resident: Resident,
  ) {
    if (!societyId) {
      return
    }

    try {
      setActionMemberId(resident.memberId)
      setActionType('reactivate')
      setActionLoading(true)
      setError('')
      setSuccessMessage('')

      await reactivateResident(
        societyId,
        resident.memberId,
      )

      setSuccessMessage(
        `${resident.email} has been reactivated.`,
      )

      await loadResidents()
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to reactivate resident.',
      )
    } finally {
      setActionLoading(false)
      setActionMemberId(null)
      setActionType(null)
    }
  }

  /*
   * Remove resident.
   */
  async function handleRemove(
    resident: Resident,
  ) {
    const confirmed = window.confirm(
      `Remove ${resident.email} from this society? This action will mark the membership as removed.`,
    )

    if (!confirmed || !societyId) {
      return
    }

    try {
      setActionMemberId(resident.memberId)
      setActionType('remove')
      setActionLoading(true)
      setError('')
      setSuccessMessage('')

      await removeResident(
        societyId,
        resident.memberId,
      )

      setSuccessMessage(
        `${resident.email} has been removed from the society.`,
      )

      await loadResidents()
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to remove resident.',
      )
    } finally {
      setActionLoading(false)
      setActionMemberId(null)
      setActionType(null)
    }
  }

  /*
   * Close change-unit modal.
   */
  function closeActionModal() {
    if (actionLoading) {
      return
    }

    setShowUnitModal(false)
    setActionMemberId(null)
    setActionType(null)
    setUnitModalBuildingId('')
    setUnitModalUnitId('')
    setUnitModalUnits([])
  }

  /*
   * Create resident invitation.
   */
  async function handleInviteResident(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!societyId) {
      setError(
        'No society is associated with this account.',
      )
      return
    }

    const email =
      inviteEmail.trim().toLowerCase()

    if (!email) {
      setError(
        'Please enter the resident email address.',
      )
      return
    }

    if (!selectedBuildingId) {
      setError('Please select a building.')
      return
    }

    if (!selectedUnitId) {
      setError('Please select a unit.')
      return
    }

    try {
      setSendingInvitation(true)
      setError('')
      setSuccessMessage('')

      const response =
        await createResidentInvitation(
          societyId,
          {
            email,
            unitId: selectedUnitId,
          },
        )

      setSuccessMessage(
        `Invitation created for ${response.email}.`,
      )

      setInviteEmail('')
      setSelectedUnitId('')
      await loadInvitations()
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to create resident invitation.',
      )
    } finally {
      setSendingInvitation(false)
    }
  }


  async function handleResendInvitation(
    invitationId: string,
  ) {
    if (!societyId) {
      return
    }

    try {
      setInvitationActionId(invitationId)
      setInvitationAction('resend')
      setError('')
      setSuccessMessage('')

      await resendResidentInvitation(
        societyId,
        invitationId,
      )

      setSuccessMessage(
        'Resident invitation resent successfully.',
      )

      await loadInvitations()
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to resend resident invitation.',
      )
    } finally {
      setInvitationActionId(null)
      setInvitationAction(null)
    }
  }

  async function handleCancelInvitation(
    invitationId: string,
  ) {
    if (!societyId) {
      return
    }

    const confirmed = window.confirm(
      'Cancel this resident invitation?',
    )

    if (!confirmed) {
      return
    }

    try {
      setInvitationActionId(invitationId)
      setInvitationAction('cancel')
      setError('')
      setSuccessMessage('')

      await cancelResidentInvitation(
        societyId,
        invitationId,
      )

      setSuccessMessage(
        'Resident invitation cancelled.',
      )

      await loadInvitations()
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          'Unable to cancel resident invitation.',
      )
    } finally {
      setInvitationActionId(null)
      setInvitationAction(null)
    }
  }

  function getInvitationStatusClasses(
    status: string,
  ) {
    switch (status) {
      case 'PENDING':
        return 'bg-[var(--color-teal-50)] text-[var(--color-teal-700)]'
      case 'ACCEPTED':
        return 'bg-green-50 text-green-700'
      case 'EXPIRED':
        return 'bg-amber-50 text-amber-700'
      case 'CANCELLED':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-[var(--color-ivory-100)] text-[var(--color-ink-700)]'
    }
  }

  function formatInvitationDate(value: string) {
    return new Date(value).toLocaleString()
  }

  function toggleInviteForm() {
    setShowInviteForm(
      (currentValue) => !currentValue,
    )

    setError('')
    setSuccessMessage('')

    if (showInviteForm) {
      setInviteEmail('')
      setSelectedBuildingId('')
      setSelectedUnitId('')
      setBuildings([])
      setUnits([])
    }
  }

  function getStatusClasses(status: string) {
    switch (status) {
      case 'ACTIVE':
        return 'bg-[var(--color-teal-50)] text-[var(--color-teal-700)]'

      case 'SUSPENDED':
        return 'bg-amber-50 text-amber-700'

      case 'REMOVED':
        return 'bg-red-50 text-red-700'

      default:
        return 'bg-[var(--color-ivory-100)] text-[var(--color-ink-700)]'
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-teal-600)] text-white">
            <Users className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[var(--color-ink-950)]">
              Residents
            </h1>

            <p className="mt-2 text-sm text-[var(--color-ink-500)]">
              View, invite, and manage society
              residents.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleInviteForm}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--color-teal-600)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <UserPlus className="h-4 w-4" />

          {showInviteForm
            ? 'Close'
            : 'Invite Resident'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError('')}
            className="shrink-0"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>

          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            className="shrink-0"
            aria-label="Dismiss success message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Invite Resident Form */}
      {showInviteForm && (
        <form
          onSubmit={handleInviteResident}
          className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-6"
        >
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-ink-900)]">
              Invite Resident
            </h2>

            <p className="mt-1 text-sm text-[var(--color-ink-500)]">
              Enter the resident email and assign
              their building and unit.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {/* Email */}
            <div>
              <label
                htmlFor="resident-email"
                className="mb-2 block text-sm font-medium text-[var(--color-ink-700)]"
              >
                Resident Email
              </label>

              <input
                id="resident-email"
                required
                type="email"
                placeholder="resident@example.com"
                value={inviteEmail}
                onChange={(event) =>
                  setInviteEmail(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-teal-600)]"
              />
            </div>

            {/* Building */}
            <div>
              <label
                htmlFor="resident-building"
                className="mb-2 block text-sm font-medium text-[var(--color-ink-700)]"
              >
                Building
              </label>

              <select
                id="resident-building"
                required
                value={selectedBuildingId}
                disabled={
                  loadingStructure ||
                  buildings.length === 0
                }
                onChange={(event) =>
                  setSelectedBuildingId(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-teal-600)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  Select building
                </option>

                {buildings.map((building) => (
                  <option
                    key={building.id}
                    value={building.id}
                  >
                    {building.name}
                    {building.code
                      ? ` (${building.code})`
                      : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit */}
            <div>
              <label
                htmlFor="resident-unit"
                className="mb-2 block text-sm font-medium text-[var(--color-ink-700)]"
              >
                Flat / Unit
              </label>

              <select
                id="resident-unit"
                required
                value={selectedUnitId}
                disabled={
                  loadingStructure ||
                  !selectedBuildingId ||
                  units.length === 0
                }
                onChange={(event) =>
                  setSelectedUnitId(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-teal-600)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  Select flat / unit
                </option>

                {units.map((unit) => (
                  <option
                    key={unit.id}
                    value={unit.id}
                  >
                    {unit.unitNumber}
                    {' Â· Floor '}
                    {unit.floorNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!loadingStructure &&
            buildings.length === 0 && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                No buildings are configured for
                this society yet.
              </div>
            )}

          {!loadingStructure &&
            selectedBuildingId &&
            units.length === 0 && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                No units are available in the
                selected building.
              </div>
            )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={
                sendingInvitation ||
                loadingStructure ||
                !societyId ||
                !selectedUnitId
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-600)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sendingInvitation && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {sendingInvitation
                ? 'Sending...'
                : 'Send Invitation'}
            </button>
          </div>
        </form>
      )}

      {/* Resident Invitations */}
      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-[var(--color-teal-600)]" />
              <h2 className="text-xl font-bold text-[var(--color-ink-950)]">
                Resident Invitations
              </h2>
            </div>

            <p className="mt-1 text-sm text-[var(--color-ink-500)]">
              Track invitations sent to prospective residents.
            </p>
          </div>

          {!loadingInvitations && (
            <span className="rounded-full bg-[var(--color-ivory-100)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-600)]">
              {invitations.length} total
            </span>
          )}
        </div>

        {loadingInvitations ? (
          <div className="mt-4 flex justify-center rounded-2xl border border-[var(--color-border)] bg-white py-10">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--color-teal-600)]" />
          </div>
        ) : invitations.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-white px-6 py-10 text-center">
            <ClipboardList className="mx-auto h-9 w-9 text-[var(--color-ink-300)]" />
            <h3 className="mt-3 text-sm font-semibold text-[var(--color-ink-900)]">
              No invitations yet
            </h3>
            <p className="mt-1 text-sm text-[var(--color-ink-500)]">
              Invitations you create will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-[var(--color-border)] bg-[var(--color-ivory-100)]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
                      Unit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
                      Expires
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {invitations.map((invitation) => {
                    const isActing =
                      invitationActionId ===
                        invitation.invitationId &&
                      invitationAction !== null

                    const canResend =
                      invitation.status === 'PENDING' ||
                      invitation.status === 'EXPIRED'

                    const canCancel =
                      invitation.status === 'PENDING'

                    return (
                      <tr
                        key={invitation.invitationId}
                        className="border-b border-[var(--color-border)] last:border-b-0"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-[var(--color-ink-400)]" />
                            <span className="font-semibold text-[var(--color-ink-900)]">
                              {invitation.email}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-[var(--color-ink-400)]">
                            Created{' '}
                            {formatInvitationDate(
                              invitation.createdAt,
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-[var(--color-ink-700)]">
                          {invitation.unitId}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getInvitationStatusClasses(
                              invitation.status,
                            )}`}
                          >
                            {invitation.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-[var(--color-ink-500)]">
                          {formatInvitationDate(
                            invitation.expiresAt,
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            {canResend && (
                              <button
                                type="button"
                                disabled={isActing}
                                onClick={() =>
                                  void handleResendInvitation(
                                    invitation.invitationId,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-ink-700)] hover:bg-[var(--color-ivory-100)] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isActing &&
                                invitationAction ===
                                  'resend' ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <RotateCcw className="h-3.5 w-3.5" />
                                )}
                                Resend
                              </button>
                            )}

                            {canCancel && (
                              <button
                                type="button"
                                disabled={isActing}
                                onClick={() =>
                                  void handleCancelInvitation(
                                    invitation.invitationId,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isActing &&
                                invitationAction ===
                                  'cancel' ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <X className="h-3.5 w-3.5" />
                                )}
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Residents */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-teal-600)]" />
        </div>
      ) : residents.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white px-6 py-16 text-center">
          <Users className="mx-auto h-10 w-10 text-[var(--color-ink-300)]" />

          <h2 className="mt-4 text-lg font-semibold text-[var(--color-ink-900)]">
            No residents found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-ink-500)]">
            Residents will appear here after
            they accept an invitation and become
            members of the society.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-ivory-100)]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
                    Resident
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
                    Unit
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-500)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {residents.map((resident) => {
                  const isActing =
                    actionMemberId ===
                      resident.memberId &&
                    actionLoading

                  return (
                    <tr
                      key={resident.memberId}
                      className="border-b border-[var(--color-border)] last:border-b-0"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold text-[var(--color-ink-900)]">
                          {resident.email}
                        </div>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-ink-400)]">
                          <Mail className="h-3.5 w-3.5" />
                          {resident.position}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-[var(--color-ink-700)]">
                        {resident.unitNumber ||
                          'Not assigned'}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-[var(--color-ivory-100)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-700)]">
                          {resident.role}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            resident.status,
                          )}`}
                        >
                          {resident.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-[var(--color-ink-500)]">
                        {new Date(
                          resident.joinedAt,
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end">
                          <div className="relative">
                            <details>
                              <summary
                                className={`flex cursor-pointer list-none items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-ink-700)] hover:bg-[var(--color-ivory-100)] ${
                                  isActing
                                    ? 'pointer-events-none opacity-50'
                                    : ''
                                }`}
                              >
                                Manage
                                <ChevronDown className="h-3.5 w-3.5" />
                              </summary>

                              <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white py-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    const details =
                                      event.currentTarget
                                        .closest(
                                          'details',
                                        )

                                    if (details) {
                                      details.open = false
                                    }

                                    void openUnitModal(
                                      resident,
                                    )
                                  }}
                                  disabled={isActing}
                                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-medium text-[var(--color-ink-700)] hover:bg-[var(--color-ivory-100)] disabled:opacity-50"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Change Unit
                                </button>

                                {resident.status ===
                                  'ACTIVE' && (
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      const details =
                                        event.currentTarget
                                          .closest(
                                            'details',
                                          )

                                      if (details) {
                                        details.open = false
                                      }

                                      void handleSuspend(
                                        resident,
                                      )
                                    }}
                                    disabled={isActing}
                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                                  >
                                    <UserX className="h-3.5 w-3.5" />
                                    Suspend
                                  </button>
                                )}

                                {resident.status ===
                                  'SUSPENDED' && (
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      const details =
                                        event.currentTarget
                                          .closest(
                                            'details',
                                          )

                                      if (details) {
                                        details.open = false
                                      }

                                      void handleReactivate(
                                        resident,
                                      )
                                    }}
                                    disabled={isActing}
                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
                                  >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    Reactivate
                                  </button>
                                )}

                                {resident.status !==
                                  'REMOVED' && (
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      const details =
                                        event.currentTarget
                                          .closest(
                                            'details',
                                          )

                                      if (details) {
                                        details.open = false
                                      }

                                      void handleRemove(
                                        resident,
                                      )
                                    }}
                                    disabled={isActing}
                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                                  >
                                    <UserX className="h-3.5 w-3.5" />
                                    Remove
                                  </button>
                                )}

                                {isActing && (
                                  <div className="flex items-center gap-2 border-t border-[var(--color-border)] px-4 py-2.5 text-xs text-[var(--color-ink-500)]">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    {actionType ===
                                    'change-unit'
                                      ? 'Updating...'
                                      : actionType ===
                                        'suspend'
                                      ? 'Suspending...'
                                      : actionType ===
                                        'reactivate'
                                      ? 'Reactivating...'
                                      : 'Removing...'}
                                  </div>
                                )}
                              </div>
                            </details>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Change Unit Modal */}
      {showUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-teal-600)]">
                  Resident Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-[var(--color-ink-950)]">
                  Change Unit
                </h2>

                <p className="mt-2 text-sm text-[var(--color-ink-500)]">
                  Select the building and new unit
                  for this resident.
                </p>
              </div>

              <button
                type="button"
                onClick={closeActionModal}
                disabled={actionLoading}
                className="rounded-lg p-2 text-[var(--color-ink-400)] hover:bg-[var(--color-ivory-100)] disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="change-unit-building"
                  className="mb-2 block text-sm font-medium text-[var(--color-ink-700)]"
                >
                  Building
                </label>

                <select
                  id="change-unit-building"
                  value={unitModalBuildingId}
                  disabled={
                    loadingStructure ||
                    actionLoading
                  }
                  onChange={(event) =>
                    void handleUnitModalBuildingChange(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)] disabled:opacity-60"
                >
                  <option value="">
                    Select building
                  </option>

                  {buildings.map((building) => (
                    <option
                      key={building.id}
                      value={building.id}
                    >
                      {building.name}
                      {building.code
                        ? ` (${building.code})`
                        : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="change-unit-unit"
                  className="mb-2 block text-sm font-medium text-[var(--color-ink-700)]"
                >
                  New Unit
                </label>

                <select
                  id="change-unit-unit"
                  value={unitModalUnitId}
                  disabled={
                    loadingStructure ||
                    actionLoading ||
                    !unitModalBuildingId ||
                    unitModalUnits.length === 0
                  }
                  onChange={(event) =>
                    setUnitModalUnitId(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-teal-600)] disabled:opacity-60"
                >
                  <option value="">
                    Select unit
                  </option>

                  {unitModalUnits.map((unit) => (
                    <option
                      key={unit.id}
                      value={unit.id}
                    >
                      {unit.unitNumber}
                      {' Â· Floor '}
                      {unit.floorNumber}
                    </option>
                  ))}
                </select>
              </div>

              {!loadingStructure &&
                unitModalBuildingId &&
                unitModalUnits.length === 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    No units are available in
                    this building.
                  </div>
                )}
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeActionModal}
                disabled={actionLoading}
                className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink-700)] hover:bg-[var(--color-ivory-100)] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleChangeUnit()}
                disabled={
                  actionLoading ||
                  loadingStructure ||
                  !unitModalUnitId
                }
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-600)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {actionLoading
                  ? 'Updating...'
                  : 'Update Unit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}