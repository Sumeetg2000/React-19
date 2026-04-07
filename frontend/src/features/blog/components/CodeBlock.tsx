import { useEffect, useRef, useState, type ReactElement } from 'react'

type CopyState = 'idle' | 'copied' | 'failed'

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language }: CodeBlockProps): ReactElement {
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const timeoutRef = useRef<number | null>(null)
  const normalizedCode = code.trim().length > 0 ? code : '// Empty code block'
  const isCopyDisabled = code.trim().length === 0

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const scheduleReset = (): void => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopyState('idle')
    }, 1800)
  }

  const handleCopy = async (): Promise<void> => {
    if (isCopyDisabled) {
      return
    }

    try {
      await navigator.clipboard.writeText(code)
      setCopyState('copied')
      scheduleReset()
    } catch {
      setCopyState('failed')
      scheduleReset()
    }
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          {language ?? 'plaintext'}
        </span>
        <button
          type="button"
          onClick={() => {
            void handleCopy()
          }}
          disabled={isCopyDisabled}
          className="rounded-md border border-slate-600 px-2 py-1 text-xs font-medium text-slate-200 transition hover:border-slate-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-slate-100">
        <code className={language ? `language-${language}` : ''}>{normalizedCode}</code>
      </pre>
    </div>
  )
}
