import type { ReactElement } from 'react'
import { Suspense, lazy } from 'react'
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { getIsAuthenticated } from '@/features/auth/utils/authState'

function RootRedirect(): ReactElement {
  return <Navigate to={getIsAuthenticated() ? '/blogs' : '/login'} replace />
}

function ProtectedBlogsPage(): ReactElement {
  const HomePage = lazy(async () => import('@/features/home/pages/HomePage').then((module) => ({ default: module.HomePage })))

  return (
    <ProtectedRoute isAuthenticated={getIsAuthenticated()}>
      <HomePage />
    </ProtectedRoute>
  )
}

function ProtectedProfilePage(): ReactElement {
  const ProfilePage = lazy(async () => import('@/features/profile/pages/ProfilePage').then((module) => ({ default: module.ProfilePage })))

  return (
    <ProtectedRoute isAuthenticated={getIsAuthenticated()}>
      <ProfilePage />
    </ProtectedRoute>
  )
}

function ProtectedCreateBlogPage(): ReactElement {
  const CreateBlogPage = lazy(async () =>
    import('@/features/blog/pages/CreateBlogPage').then((module) => ({ default: module.CreateBlogPage })),
  )

  return (
    <ProtectedRoute isAuthenticated={getIsAuthenticated()}>
      <CreateBlogPage />
    </ProtectedRoute>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootRedirect,
  },
  {
    path: '/blogs',
    Component: ProtectedBlogsPage,
  },
  {
    path: '/blogs/create',
    Component: ProtectedCreateBlogPage,
  },
  {
    path: '/profile',
    Component: ProtectedProfilePage,
  },
  {
    path: '/login',
    lazy: async () => {
      const module = await import('@/features/auth/pages/LoginPage')
      return { Component: module.LoginPage }
    },
  },
  {
    path: '/signup',
    lazy: async () => {
      const module = await import('@/features/auth/pages/SignupPage')
      return { Component: module.SignupPage }
    },
  },
])

export function AppRouter() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-600">Loading page...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
