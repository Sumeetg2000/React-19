import type { ReactElement } from 'react'
import type { Blog } from '@/shared/types/blog'

interface BlogItemProps {
  blog: Blog
}

export function BlogItem({ blog }: BlogItemProps): ReactElement {
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
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
