import type { ReactElement } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '@/shared/api/http'
import { useBlog } from '@/shared/hooks/useBlog'
import { BlogStructuredContent } from '@/features/blog/components/BlogStructuredContent'

export function BlogDetailPage(): ReactElement {
  const { id } = useParams<{ id: string }>()
  const { data: blog, isLoading, error, refetch, isFetching } = useBlog(id)

  if (!id) {
    return <BlogDetailNotFound message="Missing blog id." />
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
          </div>
        </div>
      </main>
    )
  }

  if (error instanceof ApiError && error.status === 404) {
    return <BlogDetailNotFound message={error.message} />
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            <h1 className="mb-2 text-xl font-semibold">Unable to load blog</h1>
            <p className="mb-4 text-sm">{error.message}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  void refetch()
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                {isFetching ? 'Retrying...' : 'Retry'}
              </button>
              <Link
                to="/blogs"
                viewTransition
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
              >
                Back to blogs
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!blog) {
    return <BlogDetailNotFound message="Blog not found." />
  }

  const content = blog.content.trim()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link
          to="/blogs"
          viewTransition
          className="mb-6 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to blogs
        </Link>

        <article className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <header className="mb-8 border-b border-gray-100 pb-6">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{blog.author}</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </header>

          {content.length > 0 ? (
            <BlogStructuredContent content={content} />
          ) : (
            <p className="text-base text-gray-500">This post has no content yet.</p>
          )}
        </article>
      </div>
    </main>
  )
}

function BlogDetailNotFound({ message }: { message: string }): ReactElement {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-2 text-2xl font-semibold text-gray-900">Blog not found</h1>
          <p className="mb-6 text-gray-600">{message}</p>
          <Link
            to="/blogs"
            viewTransition
            className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Return to blog list
          </Link>
        </div>
      </div>
    </main>
  )
}