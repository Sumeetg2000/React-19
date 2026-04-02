import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const module = await import('@/features/home/pages/HomePage')
      return { Component: module.HomePage }
    },
  },
])

export function AppRouter() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading page...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
