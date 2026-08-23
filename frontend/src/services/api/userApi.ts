import { apiClient } from './client'
import type { UserProfile } from '../../types/user'

export interface UpdateUserProfileRequest {
  firstName: string
  lastName: string
  phone: string
}

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>(
    '/users/me',
  )

  return response.data
}

export async function updateCurrentUser(
  request: UpdateUserProfileRequest,
): Promise<UserProfile> {
  const response = await apiClient.put<UserProfile>(
    '/users/me',
    request,
  )

  return response.data
}