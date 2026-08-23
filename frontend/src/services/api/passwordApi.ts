import { apiClient } from './client'

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  userId: string
  message: string
}

export interface ResetPasswordRequest {
  userId: string
  otp: string
  newPassword: string
  confirmPassword: string
}

export async function forgotPassword(
  request: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  const response = await apiClient.post<ForgotPasswordResponse>(
    '/auth/password/forgot',
    request,
  )

  return response.data
}

export async function resetPassword(
  request: ResetPasswordRequest,
): Promise<void> {
  await apiClient.post(
    '/auth/password/reset',
    request,
  )
}