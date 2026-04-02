import type { ReactElement } from 'react'
import { Suspense, useTransition, useState } from 'react'
import { useBlogs } from '@/shared/hooks/useBlogs'
import { BlogList } from '../components/BlogList'
import { BlogSearch } from '../components/BlogSearch'

export function HomePage(): ReactElement {
  const [search, setSearch] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const { data: blogs = [], isLoading, error } = useBlogs({ search })

  const handleSearch = (value: string): void => {
    startTransition(() => {
      setSearch(value)
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog Studio</h1>
          <p className="text-gray-600 text-lg">Discover and read great articles</p>
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
