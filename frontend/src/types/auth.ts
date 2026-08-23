export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  userId: string
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface AuthUser {
  id: string
  email?: string
  name?: string
  role?: string
}
export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface RegisterResponse {
  userId: string
  message: string
  emailVerificationRequired: boolean
}

export type OtpChannel = 'EMAIL'

export interface VerifyOtpRequest {
  userId: string
  channel: OtpChannel
  otp: string
}

export interface VerifyOtpResponse {
  message: string
  emailVerified: boolean
  phoneVerified: boolean
  registrationComplete: boolean
}
export type SocietyRole =
  | 'SOCIETY_ADMIN'
  | 'RESIDENT'

export type SocietyPosition =
  | 'OWNER'
  | 'SECRETARY'
  | 'AUTHORIZED_REPRESENTATIVE'
  | 'RESIDENT'

export type MembershipStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'REMOVED'

export type SocietyVerificationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'

export interface AuthContext {
  userId: string
  firstName: string
  lastName: string
  email: string

  emailVerified: boolean

  hasSociety: boolean
  hasActiveMembership: boolean

  societyId?: string
  societyName?: string

  role?: SocietyRole
  position?: SocietyPosition
  membershipStatus?: MembershipStatus
  societyVerificationStatus?: SocietyVerificationStatus

  unitId?: string
}