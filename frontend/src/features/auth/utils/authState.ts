const AUTH_STORAGE_KEY = 'blog-studio-is-authenticated'

export function getIsAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

export function setIsAuthenticated(value: boolean): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, value ? 'true' : 'false')
}
