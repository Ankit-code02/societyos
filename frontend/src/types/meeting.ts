export type MeetingStatus = 'SCHEDULED' | 'CANCELLED'

export interface CreateMeetingRequest {
  title: string
  description?: string
  scheduledAt: string
  venue: string
}

export interface MeetingResponse {
  id: string
  societyId: string
  createdBy: string
  createdByEmail: string
  title: string
  description?: string
  scheduledAt: string
  venue: string
  status: MeetingStatus
  createdAt: string
  updatedAt: string
}