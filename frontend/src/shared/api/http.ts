import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

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
  return nextConfig
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message ?? error.message
    return Promise.reject(new Error(message))
  },
)
