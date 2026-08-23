import { apiClient } from './client'

import type {
  Building,
  CreateBuildingRequest,
  CreateUnitRequest,
  Unit,
} from '../../types/society'

export interface CreateSocietyRequest {
  name: string
  addressLine: string
  city: string
  state: string
  pinCode: string
  buildingCount: number
  unitCount: number
  claimedPosition:
    | 'OWNER'
    | 'SECRETARY'
    | 'AUTHORIZED_REPRESENTATIVE'
}

export interface CreateSocietyResponse {
  societyId: string
  verificationId: string
  status: string
  verificationStatus: string
  message: string
}

export async function createSociety(
  request: CreateSocietyRequest,
): Promise<CreateSocietyResponse> {
  const response =
    await apiClient.post<CreateSocietyResponse>(
      '/societies',
      request,
    )

  return response.data
}

export interface UploadVerificationDocumentRequest {
  documentType: string
  fileName: string
  storageKey: string
}

export interface VerificationDocumentResponse {
  documentId: string
  verificationId: string
  documentType: string
  fileName: string
  uploadedAt: string
  message: string
}

export interface SubmitVerificationResponse {
  societyId: string
  verificationId: string
  status: string
  submittedAt: string
  message: string
}

export async function uploadSocietyVerificationDocument(
  societyId: string,
  request: UploadVerificationDocumentRequest,
): Promise<VerificationDocumentResponse> {
  const response =
    await apiClient.post<VerificationDocumentResponse>(
      `/societies/${societyId}/verification/documents`,
      request,
    )

  return response.data
}

export async function submitSocietyVerification(
  societyId: string,
): Promise<SubmitVerificationResponse> {
  const response =
    await apiClient.post<SubmitVerificationResponse>(
      `/societies/${societyId}/verification/submit`,
    )

  return response.data
}

export async function createBuilding(
  societyId: string,
  request: CreateBuildingRequest,
): Promise<Building> {
  const response =
    await apiClient.post<Building>(
      `/societies/${societyId}/buildings`,
      request,
    )

  return response.data
}

export async function getBuildings(
  societyId: string,
): Promise<Building[]> {
  const response =
    await apiClient.get<Building[]>(
      `/societies/${societyId}/buildings`,
    )

  return response.data
}

export async function createUnit(
  societyId: string,
  buildingId: string,
  request: CreateUnitRequest,
): Promise<Unit> {
  const response =
    await apiClient.post<Unit>(
      `/societies/${societyId}/buildings/${buildingId}/units`,
      request,
    )

  return response.data
}

export async function getUnits(
  societyId: string,
  buildingId: string,
): Promise<Unit[]> {
  const response =
    await apiClient.get<Unit[]>(
      `/societies/${societyId}/buildings/${buildingId}/units`,
    )

  return response.data
}
export async function getAllUnits(
  societyId: string,
): Promise<Unit[]> {
  const buildings = await getBuildings(societyId)

  const unitLists = await Promise.all(
    buildings.map((building) =>
      getUnits(societyId, building.id),
    ),
  )

  return unitLists.flat()
}
export interface MySocietyResponse {
  societyId: string
  societyName: string
  societyStatus: string
  role: string
  position: string
  membershipStatus: string
}

export async function getMySocieties(): Promise<MySocietyResponse[]> {
  const response =
    await apiClient.get<MySocietyResponse[]>(
      '/societies/mine',
    )

  return response.data
}