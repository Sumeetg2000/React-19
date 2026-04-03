import type { AuthActionState } from '../types/auth'
import { http } from '@/shared/api/http'
import { setAuthToken } from '../utils/authState'

interface LoginResponse {
  data: {
    token: string
  }
}

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' }
  }

  try {
    const response = await http.post<LoginResponse>('/auth/login', { email, password })
    setAuthToken(response.data.data.token)
    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Login failed.' }
  }
}
