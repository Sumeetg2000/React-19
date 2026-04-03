export interface AuthActionState {
  success: boolean
  error: string | null
}

export interface LoginFields {
  email: string
  password: string
}

export interface SignupFields {
  name: string
  email: string
  password: string
  confirmPassword: string
}
