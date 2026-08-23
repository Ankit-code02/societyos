import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

import { refreshToken } from './authApi'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8080/api/v1'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise: Promise<string | null> | null = null

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(
      'societyos_access_token',
    )

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
)

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config

    if (
      error.response?.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error)
    }

    const refreshTokenValue = localStorage.getItem(
      'societyos_refresh_token',
    )

    if (!refreshTokenValue) {
      clearSession()
      return Promise.reject(error)
    }

    if (
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/logout')
    ) {
      clearSession()
      return Promise.reject(error)
    }

    try {
      if (!refreshPromise) {
        refreshPromise = refreshToken(
          refreshTokenValue,
        )
          .then((response) => {
            localStorage.setItem(
              'societyos_access_token',
              response.accessToken,
            )

            localStorage.setItem(
              'societyos_refresh_token',
              response.refreshToken,
            )

            return response.accessToken
          })
          .catch(() => {
            clearSession()
            return null
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      const newAccessToken = await refreshPromise

      if (!newAccessToken) {
        return Promise.reject(error)
      }

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`

      return apiClient(originalRequest)
    } catch {
      clearSession()
      return Promise.reject(error)
    }
  },
)

function clearSession() {
  localStorage.removeItem(
    'societyos_access_token',
  )

  localStorage.removeItem(
    'societyos_refresh_token',
  )

  localStorage.removeItem(
    'societyos_user_id',
  )

  localStorage.removeItem(
    'societyos_user',
  )
}