import type { ReactElement } from 'react'
import { useActionState, useTransition } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/shared/api/http'

interface Profile {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

interface ProfileResponse {
  data: Profile
}

interface ProfileActionState {
  success: boolean
  error: string | null
}

const initialState: ProfileActionState = {
  success: false,
  error: null,
}

async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const name = formData.get('name') as string

  if (!name || !name.trim()) {
    return { success: false, error: 'Name is required.' }
  }

  try {
    await http.put('/profile', { name: name.trim() })
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Profile update failed.',
    }
  }
}

export function ProfilePage(): ReactElement {
  const queryClient = useQueryClient()
  // useTransition keeps cache invalidation refresh non-blocking after successful save.
  const [isInvalidating, startTransition] = useTransition()

  // useActionState keeps async form mutation state in sync with rendered success/error UI.
  const [state, action] = useActionState(async (prevState: ProfileActionState, formData: FormData) => {
    const result = await updateProfileAction(prevState, formData)

    if (result.success) {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ['profile'] })
      })
    }

    return result
  }, initialState)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<Profile> => {
      const response = await http.get<ProfileResponse>('/profile')
      return response.data.data
    },
  })

  if (isLoading) {
    return <main className="min-h-screen bg-gray-50 p-6 text-center text-gray-600">Loading profile...</main>
  }

  if (error instanceof Error) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p>{error.message}</p>
          <button
            type="button"
            onClick={() => {
              void refetch()
            }}
            className="mt-3 inline-flex rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  if (!data) {
    return <main className="min-h-screen bg-gray-50 p-6 text-center text-gray-600">Profile not found.</main>
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <Link to="/blogs" viewTransition className="text-sm font-medium text-blue-600 hover:underline">
            Back to Blogs
          </Link>
        </div>

        {isInvalidating && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
            Syncing profile changes...
          </div>
        )}

        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Email:</span> {data.email}
          </p>
          <p className="mt-1">
            <span className="font-semibold">Current Name:</span> {data.name}
          </p>
        </div>

        {state.success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            Profile updated successfully.
          </div>
        )}

        {state.error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        {/* form action connects browser submit to React Action ordering and pending state. */}
        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Update name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={data.name}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save changes
          </button>
        </form>
      </div>
    </main>
  )
}
