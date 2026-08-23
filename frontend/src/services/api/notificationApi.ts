import { apiClient } from './client'

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  readAt: string | null
}

export interface NotificationCountResponse {
  unreadCount: number
}

export async function getNotifications(): Promise<Notification[]> {
  const response = await apiClient.get<Notification[]>(
    '/notifications',
  )

  return response.data
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response =
    await apiClient.get<NotificationCountResponse>(
      '/notifications/unread-count',
    )

  return response.data.unreadCount
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<void> {
  await apiClient.put(
    `/notifications/${notificationId}/read`,
  )
}