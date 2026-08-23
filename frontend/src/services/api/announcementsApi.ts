import { apiClient } from './client'

import type {
  AnnouncementResponse,
  CreateAnnouncementRequest,
} from '../../types/announcement'

export async function getPublishedAnnouncements(
  societyId: string,
): Promise<AnnouncementResponse[]> {
  const response = await apiClient.get<AnnouncementResponse[]>(
    `/societies/${societyId}/announcements/published`,
  )

  return response.data
}

export async function getAllAnnouncements(
  societyId: string,
): Promise<AnnouncementResponse[]> {
  const response = await apiClient.get<AnnouncementResponse[]>(
    `/societies/${societyId}/announcements`,
  )

  return response.data
}

export async function createAnnouncement(
  societyId: string,
  data: CreateAnnouncementRequest,
): Promise<AnnouncementResponse> {
  const response = await apiClient.post<AnnouncementResponse>(
    `/societies/${societyId}/announcements`,
    data,
  )

  return response.data
}

export async function publishAnnouncement(
  societyId: string,
  announcementId: string,
): Promise<AnnouncementResponse> {
  const response = await apiClient.post<AnnouncementResponse>(
    `/societies/${societyId}/announcements/${announcementId}/publish`,
  )

  return response.data
}