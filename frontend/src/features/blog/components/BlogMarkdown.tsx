import { isValidElement, type ReactElement, type ReactNode, type ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'
import './blog-markdown.css'

interface BlogMarkdownProps {
  content: string
}

// Define a helper type for elements that have children props
interface PropsWithChildren {
  children?: ReactNode
  className?: string
}

function getLanguage(className?: string): string | undefined {
  if (!className) return undefined
  const match = className.match(/language-([a-z0-9-]+)/i)
  return match?.[1]
}

function normalizeNodeText(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }
  if (!children || typeof children === 'boolean') {
    return ''
  }
  if (Array.isArray(children)) {
    return children.map((child) => normalizeNodeText(child)).join('')
  }
  if (isValidElement<PropsWithChildren>(children)) {
    return normalizeNodeText(children.props.children)
  }
  return ''
}

export function BlogMarkdown({ content }: BlogMarkdownProps): ReactElement {
  return (
    <div className="blog-markdown prose prose-slate max-w-none text-base leading-8 text-gray-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre({ children }) {
            // Convert to array to handle cases where children is [whitespace, codeElement]
            const childrenArray = Array.isArray(children) ? children : [children]
            
            // Find the <code> element by checking the type or className
            const codeElement = childrenArray.find((child): child is ReactElement<PropsWithChildren> => {
              return (
                isValidElement<PropsWithChildren>(child) && 
                (child.type === 'code' || !!child.props.className)
              )
            })

            const language = getLanguage(codeElement?.props.className)
            
            // Extract text from the entire tree to bypass syntax highlighting spans
            const rawCode = normalizeNodeText(children).replace(/\n$/, '')

            return <CodeBlock code={rawCode} language={language} />
          },
          
          code({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) {
            const isBlock = !!className
            const rawCode = normalizeNodeText(children)

            if (isBlock) {
              // The 'pre' handler above takes over for blocks
              return <code className={className} {...props}>{children}</code>
            }

            return (
              <code
                className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800"
                {...props}
              >
                {rawCode}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}