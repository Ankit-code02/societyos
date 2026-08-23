import { apiClient } from './client'

export interface Resident {
  memberId: string
  userId: string
  email: string
  societyId: string
  unitId: string | null
  unitNumber: string | null
  role: string
  position: string
  status: string
  joinedAt: string
}

export interface ChangeResidentUnitRequest {
  unitId: string
}

export async function getResidents(
  societyId: string,
): Promise<Resident[]> {
  const response = await apiClient.get<Resident[]>(
    `/societies/${societyId}/residents`,
  )

  return response.data
}

export async function changeResidentUnit(
  societyId: string,
  memberId: string,
  unitId: string,
): Promise<Resident> {
  const response = await apiClient.patch<Resident>(
    `/societies/${societyId}/residents/${memberId}/unit`,
    {
      unitId,
    },
  )

  return response.data
}

export async function suspendResident(
  societyId: string,
  memberId: string,
): Promise<Resident> {
  const response = await apiClient.patch<Resident>(
    `/societies/${societyId}/residents/${memberId}/suspend`,
  )

  return response.data
}

export async function reactivateResident(
  societyId: string,
  memberId: string,
): Promise<Resident> {
  const response = await apiClient.patch<Resident>(
    `/societies/${societyId}/residents/${memberId}/reactivate`,
  )

  return response.data
}

export async function removeResident(
  societyId: string,
  memberId: string,
): Promise<Resident> {
  const response = await apiClient.delete<Resident>(
    `/societies/${societyId}/residents/${memberId}`,
  )

  return response.data
}