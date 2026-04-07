import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { signupAction } from './signup.action'
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

describe('signupAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns validation error when fields are missing', async () => {
    const formData = new FormData()
    const result = await signupAction({ success: false, error: null }, formData)

    expect(result).toEqual({ success: false, error: 'All fields are required.' })
    expect(http.post).not.toHaveBeenCalled()
  })

  it('returns validation error when passwords do not match', async () => {
    const formData = new FormData()
    formData.set('name', 'Sumeet')
    formData.set('email', 'user@example.com')
    formData.set('password', 'pass123')
    formData.set('confirmPassword', 'mismatch')

    const result = await signupAction({ success: false, error: null }, formData)

    expect(result).toEqual({ success: false, error: 'Passwords do not match.' })
    expect(http.post).not.toHaveBeenCalled()
  })

  it('stores token and returns success when payload is valid', async () => {
    ;(http.post as jest.Mock).mockImplementation(async () => ({ data: { data: { token: 'jwt-token' } } }))

    const formData = new FormData()
    formData.set('name', 'Sumeet')
    formData.set('email', 'user@example.com')
    formData.set('password', 'pass123')
    formData.set('confirmPassword', 'pass123')

    const result = await signupAction({ success: false, error: null }, formData)

    expect(http.post).toHaveBeenCalledWith('/auth/signup', {
      name: 'Sumeet',
      email: 'user@example.com',
      password: 'pass123',
    })
    expect(setAuthToken).toHaveBeenCalledWith('jwt-token')
    expect(result).toEqual({ success: true, error: null })
  })
})
