import { apiClient } from './client'

export type OtpChannel = 'EMAIL' | 'PHONE'

export interface VerifyOtpRequest {
  userId: string
  channel: OtpChannel
  otp: string
}

export interface VerifyOtpResponse {
  userId: string
  message: string
  emailVerified: boolean
  phoneVerified: boolean
  accountActive: boolean
}

export async function verifyOtp(
  request: VerifyOtpRequest,
): Promise<VerifyOtpResponse> {
  const response = await apiClient.post<VerifyOtpResponse>(
    '/auth/verification/verify',
    request,
  )

  return response.data
}
export async function resendVerificationOtp(
  userId: string,
): Promise<void> {
  await apiClient.post(
    `/auth/verification/resend?userId=${encodeURIComponent(userId)}`,
  )
}