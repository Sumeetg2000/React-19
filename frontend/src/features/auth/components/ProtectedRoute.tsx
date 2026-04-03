import type { ReactElement, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  isAuthenticated: boolean
  children: ReactNode
}

export function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps): ReactElement {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
