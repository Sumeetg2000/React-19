import type { AuthActionState } from '../types/auth'
import { http } from '@/shared/api/http'
import { setIsAuthenticated } from '../utils/authState'

export async function signupAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!email || !password || !confirmPassword) {
    return { success: false, error: 'All fields are required.' }
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' }
  }

  try {
    await http.post('/auth/signup', { email, password })
    setIsAuthenticated(true)
    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Signup failed.' }
  }
}
