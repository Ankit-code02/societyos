import { apiClient } from './client'

import type {
  CreateMaintenanceDueRequest,
  MaintenanceDueResponse,
} from '../../types/maintenance'
export interface DemoPaymentResponse {
  paymentId: string
  maintenanceDueId: string
  amount: number
  status: string
  transactionReference: string
  paidAt: string
  message: string
}
export async function getSocietyMaintenanceDues(
  societyId: string,
): Promise<MaintenanceDueResponse[]> {
  const response = await apiClient.get<MaintenanceDueResponse[]>(
    `/societies/${societyId}/maintenance-dues`,
  )

  return response.data
}

export async function getUnitMaintenanceDues(
  societyId: string,
  unitId: string,
): Promise<MaintenanceDueResponse[]> {
  const response = await apiClient.get<MaintenanceDueResponse[]>(
    `/societies/${societyId}/units/${unitId}/maintenance-dues`,
  )

  return response.data
}

export async function createMaintenanceDue(
  societyId: string,
  data: CreateMaintenanceDueRequest,
): Promise<MaintenanceDueResponse> {
  const response = await apiClient.post<MaintenanceDueResponse>(
    `/societies/${societyId}/maintenance-dues`,
    data,
  )

  return response.data
}

export async function markMaintenanceDueAsPaid(
  societyId: string,
  dueId: string,
): Promise<MaintenanceDueResponse> {
  const response = await apiClient.put<MaintenanceDueResponse>(
    `/societies/${societyId}/maintenance-dues/${dueId}/pay`,
  )

  return response.data
}
export async function makeDemoMaintenancePayment(
  societyId: string,
  dueId: string,
): Promise<DemoPaymentResponse> {
  const response =
    await apiClient.post<DemoPaymentResponse>(
      `/societies/${societyId}/maintenance-dues/${dueId}/demo-pay`,
    )

  return response.data
}