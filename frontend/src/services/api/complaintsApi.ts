import { apiClient } from './client'

import type {
  ComplaintResponse,
  CreateComplaintRequest,
} from '../../types/complaint'

export async function getMyComplaints(
  societyId: string,
): Promise<ComplaintResponse[]> {
  const response = await apiClient.get<ComplaintResponse[]>(
    `/societies/${societyId}/complaints/my`,
  )

  return response.data
}

export async function createComplaint(
  societyId: string,
  data: CreateComplaintRequest,
): Promise<ComplaintResponse> {
  const response = await apiClient.post<ComplaintResponse>(
    `/societies/${societyId}/complaints`,
    data,
  )

  return response.data
}
export async function getSocietyComplaints(
  societyId: string,
): Promise<ComplaintResponse[]> {
  const response = await apiClient.get<ComplaintResponse[]>(
    `/societies/${societyId}/complaints`,
  )

  return response.data
}

export async function assignComplaint(
  societyId: string,
  complaintId: string,
  assignedTo: string,
): Promise<ComplaintResponse> {
  const response = await apiClient.put<ComplaintResponse>(
    `/societies/${societyId}/complaints/${complaintId}/assign`,
    { assignedTo },
  )

  return response.data
}

export async function updateComplaintStatus(
  societyId: string,
  complaintId: string,
  status: ComplaintResponse['status'],
  resolutionNote?: string,
): Promise<ComplaintResponse> {
  const response = await apiClient.put<ComplaintResponse>(
    `/societies/${societyId}/complaints/${complaintId}/status`,
    {
      status,
      resolutionNote,
    },
  )

  return response.data
}