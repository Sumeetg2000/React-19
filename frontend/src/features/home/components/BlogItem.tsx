import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import type { Blog } from '@/shared/types/blog'

interface BlogItemProps {
  blog: Blog
}

export function BlogItem({ blog }: BlogItemProps): ReactElement {
  return (
    <article className="rounded-lg border border-gray-200 transition-shadow duration-200 hover:shadow-md">
      <Link
        to={`/blogs/${blog.id}`}
        viewTransition
        className="block rounded-lg p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <h3 className="mb-2 text-xl font-semibold text-gray-900">{blog.title}</h3>
        <p className="mb-4 text-base text-gray-700 line-clamp-2">{blog.excerpt}</p>

        <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
          <span className="font-medium">{blog.author}</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span key={tag} className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  )
}
