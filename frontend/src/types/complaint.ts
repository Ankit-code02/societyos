export type ComplaintCategory =
  | 'MAINTENANCE'
  | 'SECURITY'
  | 'CLEANLINESS'
  | 'WATER'
  | 'ELECTRICITY'
  | 'PARKING'
  | 'NOISE'
  | 'OTHER'

export type ComplaintPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT'

export type ComplaintStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED'

export interface CreateComplaintRequest {
  category: ComplaintCategory
  title: string
  description: string
  priority?: ComplaintPriority
  unitId?: string
}

export interface ComplaintResponse {
  id: string
  societyId: string
  createdBy: string
  createdByEmail: string
  unitId?: string
  unitNumber?: string
  category: ComplaintCategory
  title: string
  description: string
  priority?: ComplaintPriority
  status: ComplaintStatus
  assignedTo?: string
  assignedToEmail?: string
  resolutionNote?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}