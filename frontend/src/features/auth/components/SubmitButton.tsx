import type { ReactElement } from 'react'
import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  label: string
  pendingLabel?: string
  className?: string
}

export function SubmitButton({ label, pendingLabel = 'Loading...', className = 'w-full' }: SubmitButtonProps): ReactElement {
  // useFormStatus reads pending form action state without introducing local loading state.
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
