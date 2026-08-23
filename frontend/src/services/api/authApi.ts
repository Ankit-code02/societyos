import { apiClient } from './client'
import type {
    AuthContext,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '../../types/auth'

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}
export async function getAuthContext(): Promise<AuthContext> {
  const response = await apiClient.get<AuthContext>(
    '/auth/me',
  )

  return response.data
}
export async function login(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/auth/login',
    credentials,
  )

  return response.data
}

export async function refreshToken(
  refreshTokenValue: string,
): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>(
    '/auth/refresh',
    {
      refreshToken: refreshTokenValue,
    },
  )

  return response.data
}

export async function logout(
  refreshTokenValue: string,
): Promise<void> {
  await apiClient.post('/auth/logout', {
    refreshToken: refreshTokenValue,
  })
}
export async function register(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>(
    '/auth/register',
    data,
  )

  return response.data
}

export async function verifyOtp(
  data: VerifyOtpRequest,
): Promise<VerifyOtpResponse> {
  const response = await apiClient.post<VerifyOtpResponse>(
    '/auth/verification/verify',
    data,
  )

  return response.data
}