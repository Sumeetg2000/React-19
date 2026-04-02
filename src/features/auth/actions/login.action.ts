import type { AuthActionState } from '../types/auth'
import { http } from '@/shared/api/http'
import { setIsAuthenticated } from '../utils/authState'

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
    await http.post('/auth/login', { email, password })
    setIsAuthenticated(true)
    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Login failed.' }
  }
}
