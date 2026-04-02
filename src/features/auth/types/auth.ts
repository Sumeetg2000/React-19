export interface AuthActionState {
  success: boolean
  error: string | null
}

export interface LoginFields {
  email: string
  password: string
}

export interface SignupFields {
  email: string
  password: string
  confirmPassword: string
}
