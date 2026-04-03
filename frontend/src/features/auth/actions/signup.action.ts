import type { AuthActionState } from '../types/auth'
import { http } from '@/shared/api/http'
import { setAuthToken } from '../utils/authState'

interface SignupResponse {
  data: {
    token: string
  }
}

export async function signupAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!name || !email || !password || !confirmPassword) {
    return { success: false, error: 'All fields are required.' }
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' }
  }

  try {
    const response = await http.post<SignupResponse>('/auth/signup', { name, email, password })
    setAuthToken(response.data.data.token)
    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Signup failed.' }
  }
}
