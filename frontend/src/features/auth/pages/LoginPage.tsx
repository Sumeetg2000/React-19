import type { ReactElement } from 'react'
import { useActionState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { loginAction } from '../actions/login.action'
import { SubmitButton } from '../components/SubmitButton'
import { getIsAuthenticated } from '../utils/authState'

const initialState = { success: false, error: null }

export function LoginPage(): ReactElement {
  // useActionState manages async mutation result state in the form lifecycle.
  const [state, action] = useActionState(loginAction, initialState)

  if (getIsAuthenticated() || state.success) {
    return <Navigate to="/blogs" replace />
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign in</h1>

        {state.success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Login successful!
          </div>
        )}
        {state.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {state.error}
          </div>
        )}

        {/* form action wires submission into React Action handling automatically. */}
        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <SubmitButton label="Sign in" />
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {"Don't have an account? "}
          <Link to="/signup" viewTransition className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
