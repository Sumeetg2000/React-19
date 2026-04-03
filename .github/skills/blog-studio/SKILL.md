---
name: blog-studio-feature
description: "Use when: implementing Blog Studio feature with blog list page, React Query fetching, search/filter with startTransition, and Tailwind styling"
applyTo: "src/features/home/**"
---

# Blog Studio Feature Implementation

Atomic implementation of blog list page with React Query integration, filtering with startTransition, and Tailwind CSS styling.

## Components

### Blog Types

File: `src/shared/types/blog.ts`

```typescript
export interface Blog {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  tags: string[]
}
```

### Blog Query Hook

File: `src/shared/hooks/useBlogs.ts`

```typescript
import { useQuery } from '@tanstack/react-query'
import type { Blog } from '@/shared/types/blog'
import { http } from '@/shared/api/http'

export interface UseBlogsOptions {
  search?: string
}

export function useBlogs(options: UseBlogsOptions = {}): ReturnType<typeof useQuery<Blog[]>> {
  return useQuery({
    queryKey: ['blogs', options.search],
    queryFn: async (): Promise<Blog[]> => {
      const { data } = await http.get<Blog[]>('/blogs', {
        params: options.search ? { search: options.search } : {},
      })
      return data
    },
  })
}
```

### Blog List Item Component

File: `src/features/home/components/BlogItem.tsx`

```typescript
import type { Blog } from '@/shared/types/blog'

interface BlogItemProps {
  blog: Blog
}

export function BlogItem({ blog }: BlogItemProps): JSX.Element {
  return (
    <article className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h3>
      <p className="text-gray-700 text-base mb-4 line-clamp-2">{blog.excerpt}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span className="font-medium">{blog.author}</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>

      {blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
```

### Blog List Component

File: `src/features/home/components/BlogList.tsx`

```typescript
import type { Blog } from '@/shared/types/blog'
import { BlogItem } from './BlogItem'

interface BlogListProps {
  blogs: Blog[]
  isLoading: boolean
  error: Error | null
}

export function BlogList({ blogs, isLoading, error }: BlogListProps): JSX.Element {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium">Error loading blogs</p>
        <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No blogs found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <BlogItem key={blog.id} blog={blog} />
      ))}
    </div>
  )
}
```

### Blog Search Component

File: `src/features/home/components/BlogSearch.tsx`

```typescript
interface BlogSearchProps {
  value: string
  onChange: (value: string) => void
}

export function BlogSearch({ value, onChange }: BlogSearchProps): JSX.Element {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search blogs..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>
  )
}
```

### Updated Home Page

File: `src/features/home/pages/HomePage.tsx`

```typescript
import { Suspense, useTransition, useState } from 'react'
import { useBlogs } from '@/shared/hooks/useBlogs'
import { BlogList } from '../components/BlogList'
import { BlogSearch } from '../components/BlogSearch'

export function HomePage(): JSX.Element {
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
```

## Features

- React Query for server state management and caching
- startTransition for non-blocking search updates
- Search/filter functionality
- Tailwind CSS utility classes (no inline styles)
- Strict TypeScript with explicit types
- Modular, reusable components
- Error handling and loading states
- Accessible form inputs
