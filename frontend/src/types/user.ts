export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: string
  emailVerifiedAt: string | null
  phoneVerifiedAt: string | null
}