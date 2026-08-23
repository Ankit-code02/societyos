import { apiClient } from './client'

import type {
  CreateMeetingRequest,
  MeetingResponse,
} from '../../types/meeting'

export async function getMeetings(
  societyId: string,
): Promise<MeetingResponse[]> {
  const response = await apiClient.get<MeetingResponse[]>(
    `/societies/${societyId}/meetings`,
  )

  return response.data
}

export async function getUpcomingMeetings(
  societyId: string,
): Promise<MeetingResponse[]> {
  const response = await apiClient.get<MeetingResponse[]>(
    `/societies/${societyId}/meetings/upcoming`,
  )

  return response.data
}

export async function createMeeting(
  societyId: string,
  data: CreateMeetingRequest,
): Promise<MeetingResponse> {
  const response = await apiClient.post<MeetingResponse>(
    `/societies/${societyId}/meetings`,
    data,
  )

  return response.data
}

export async function cancelMeeting(
  societyId: string,
  meetingId: string,
): Promise<MeetingResponse> {
  const response = await apiClient.put<MeetingResponse>(
    `/societies/${societyId}/meetings/${meetingId}/cancel`,
  )

  return response.data
}