export type MaintenanceDueStatus = 'PENDING' | 'PAID'

export interface MaintenanceDueResponse {
  id: string
  societyId: string
  unitId: string
  unitNumber: string
  title: string
  description?: string
  amount: number
  dueDate: string
  status: MaintenanceDueStatus
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateMaintenanceDueRequest {
  unitId: string
  title: string
  description?: string
  amount: number
  dueDate: string
}