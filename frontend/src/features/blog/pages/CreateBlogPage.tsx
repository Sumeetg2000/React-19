import type { ReactElement } from 'react'
import { useActionState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { SubmitButton } from '@/features/auth/components/SubmitButton'
import { http } from '@/shared/api/http'

interface CreateBlogActionState {
  success: boolean
  error: string | null
}

const initialState: CreateBlogActionState = {
  success: false,
  error: null,
}

async function createBlogAction(
  _prev: CreateBlogActionState,
  formData: FormData,
): Promise<CreateBlogActionState> {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !title.trim() || !content || !content.trim()) {
    return { success: false, error: 'Title and content are required.' }
  }

  try {
    await http.post('/blogs', {
      title: title.trim(),
      content: content.trim(),
    })

    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Blog creation failed.',
    }
  }
}

export function CreateBlogPage(): ReactElement {
  const [state, action] = useActionState(createBlogAction, initialState)

  if (state.success) {
    return <Navigate to="/blogs" replace />
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Create Blog</h1>
          <Link to="/blogs" className="text-sm font-medium text-blue-600 hover:underline">
            Back to Blogs
          </Link>
        </div>

        {state.error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <SubmitButton
            label="Publish blog"
            pendingLabel="Publishing..."
            className="inline-flex text-sm font-medium"
          />
        </form>
      </div>
    </main>
  )
}
