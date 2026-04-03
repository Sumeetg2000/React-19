import type { ReactElement } from 'react'
import { Suspense, useDeferredValue, useTransition, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearAuthToken } from '@/features/auth/utils/authState'
import { useBlogs } from '@/shared/hooks/useBlogs'
import { BlogList } from '../components/BlogList'
import { BlogSearch } from '../components/BlogSearch'

export function HomePage(): ReactElement {
  const navigate = useNavigate()
  const [search, setSearch] = useState<string>('')
  const deferredSearch = useDeferredValue(search)
  const [isPending, startTransition] = useTransition()
  const { data: blogs = [], isLoading, error } = useBlogs({ search: deferredSearch })

  const handleSearch = (value: string): void => {
    startTransition(() => {
      setSearch(value)
    })
  }

  const handleLogout = (): void => {
    clearAuthToken()
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog Studio</h1>
              <p className="text-gray-600 text-lg">Discover and read great articles</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/blogs/create"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create Blog
              </Link>
              <Link to="/profile" className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <BlogSearch value={search} onChange={handleSearch} />

        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <div className={isPending ? 'opacity-60 pointer-events-none' : ''}>
            <BlogList blogs={blogs} isLoading={isLoading} error={error instanceof Error ? error : null} />
          </div>
        </Suspense>
      </div>
    </main>
  )
}
