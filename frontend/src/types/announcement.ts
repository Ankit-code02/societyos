export type AnnouncementStatus = 'DRAFT' | 'PUBLISHED'

export interface AnnouncementResponse {
  id: string
  societyId: string
  createdBy: string
  createdByEmail: string
  title: string
  content: string
  category: string
  status: AnnouncementStatus
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAnnouncementRequest {
  title: string
  content: string
  category: string
}