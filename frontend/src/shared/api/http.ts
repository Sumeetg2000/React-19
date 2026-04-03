import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getAuthToken } from '@/features/auth/utils/authState'

const baseURL = 'http://localhost:3000'

export const http = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const nextConfig = { ...config }
  nextConfig.headers.set('X-App-Client', 'blog-studio')
  const token = getAuthToken()
  if (token) {
    nextConfig.headers.set('Authorization', `Bearer ${token}`)
  }
  return nextConfig
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message ?? error.message
    return Promise.reject(new Error(message))
  },
)
