import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { loginAction } from './login.action'
import { http } from '@/shared/api/http'
import { setAuthToken } from '../utils/authState'

jest.mock('@/shared/api/http', () => ({
  http: {
    post: jest.fn(),
  },
}))

jest.mock('../utils/authState', () => ({
  setAuthToken: jest.fn(),
}))

describe('loginAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns validation error when required fields are missing', async () => {
    const formData = new FormData()
    const result = await loginAction({ success: false, error: null }, formData)

    expect(result).toEqual({ success: false, error: 'Email and password are required.' })
    expect(http.post).not.toHaveBeenCalled()
  })

  it('stores token and returns success on valid credentials', async () => {
    ;(http.post as jest.Mock).mockImplementation(async () => ({ data: { data: { token: 'jwt-token' } } }))

    const formData = new FormData()
    formData.set('email', 'user@example.com')
    formData.set('password', 'pass123')

    const result = await loginAction({ success: false, error: null }, formData)

    expect(http.post).toHaveBeenCalledWith('/auth/login', {
      email: 'user@example.com',
      password: 'pass123',
    })
    expect(setAuthToken).toHaveBeenCalledWith('jwt-token')
    expect(result).toEqual({ success: true, error: null })
  })
})
