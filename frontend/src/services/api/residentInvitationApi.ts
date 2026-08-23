import { apiClient } from './client'

export interface CreateResidentInvitationRequest {
  email: string
  unitId: string
}

export interface ResidentInvitationResponse {
  invitationId: string
  societyId: string
  unitId: string
  email: string
  status: string
  expiresAt: string
  createdAt: string
}

export interface ResidentInvitationPreviewResponse {
  invitationId: string
  societyId: string
  societyName: string
  unitId: string
  unitNumber: string
  floorNumber: number
  email: string
  status: string
  expiresAt: string
}

export interface AcceptResidentInvitationRequest {
  token: string
}

export async function createResidentInvitation(
  societyId: string,
  request: CreateResidentInvitationRequest,
): Promise<ResidentInvitationResponse> {
  const response =
    await apiClient.post<ResidentInvitationResponse>(
      `/societies/${societyId}/resident-invitations`,
      request,
    )

  return response.data
}

export async function getResidentInvitationPreview(
  token: string,
): Promise<ResidentInvitationPreviewResponse> {
  const response =
    await apiClient.get<ResidentInvitationPreviewResponse>(
      '/resident-invitations/preview',
      {
        params: {
          token,
        },
      },
    )

  return response.data
}

export async function acceptResidentInvitation(
  request: AcceptResidentInvitationRequest,
): Promise<ResidentInvitationResponse> {
  const response =
    await apiClient.post<ResidentInvitationResponse>(
      '/resident-invitations/accept',
      request,
    )

  return response.data
}

/**
 * Get all resident invitations for a society.
 */
export async function getResidentInvitations(
  societyId: string,
): Promise<ResidentInvitationResponse[]> {
  const response =
    await apiClient.get<ResidentInvitationResponse[]>(
      `/societies/${societyId}/resident-invitations`,
    )

  return response.data
}

/**
 * Resend a resident invitation.
 */
export async function resendResidentInvitation(
  societyId: string,
  invitationId: string,
): Promise<ResidentInvitationResponse> {
  const response =
    await apiClient.post<ResidentInvitationResponse>(
      `/societies/${societyId}/resident-invitations/${invitationId}/resend`,
    )

  return response.data
}

/**
 * Cancel a pending resident invitation.
 */
export async function cancelResidentInvitation(
  societyId: string,
  invitationId: string,
): Promise<ResidentInvitationResponse> {
  const response =
    await apiClient.delete<ResidentInvitationResponse>(
      `/societies/${societyId}/resident-invitations/${invitationId}`,
    )

  return response.data
}