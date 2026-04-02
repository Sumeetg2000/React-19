import type { ReactElement } from 'react'
import type { Blog } from '@/shared/types/blog'
import { BlogItem } from './BlogItem'

interface BlogListProps {
  blogs: Blog[]
  isLoading: boolean
  error: Error | null
}

export function BlogList({ blogs, isLoading, error }: BlogListProps): ReactElement {
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
