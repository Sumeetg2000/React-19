import type { ReactElement, ReactNode } from 'react';
import { BlogMarkdown } from './BlogMarkdown';
import { CodeBlock } from './CodeBlock';
import { parseStructuredBlog } from '../utils/structuredBlog';

interface BlogStructuredContentProps {
  content: string;
}

const SECTION_LABEL_STYLES: Record<string, string> = {
  Overview: 'text-blue-700 bg-blue-50 border-blue-200',
  Prerequisites: 'text-amber-700 bg-amber-50 border-amber-200',
  'Problem Statement': 'text-red-700 bg-red-50 border-red-200',
  'Concept Explanation': 'text-violet-700 bg-violet-50 border-violet-200',
  'Core API / Syntax': 'text-teal-700 bg-teal-50 border-teal-200',
  'Code Example': 'text-slate-700 bg-slate-50 border-slate-200',
  'Explanation of Code': 'text-indigo-700 bg-indigo-50 border-indigo-200',
  'Real-World Use Case': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Performance Impact': 'text-orange-700 bg-orange-50 border-orange-200',
  'When to Use': 'text-green-700 bg-green-50 border-green-200',
  'When NOT to Use': 'text-rose-700 bg-rose-50 border-rose-200',
  Pros: 'text-green-700 bg-green-50 border-green-200',
  Cons: 'text-red-700 bg-red-50 border-red-200',
  'Common Mistakes': 'text-amber-700 bg-amber-50 border-amber-200',
  'Best Practices': 'text-blue-700 bg-blue-50 border-blue-200',
  Conclusion: 'text-gray-700 bg-gray-50 border-gray-200',
};

function renderInlineCode(text: string): ReactNode[] {
  const parts = text.split(/`([^`]+)`/g);
  return parts.map((part, i) => {
    if (i % 2 === 0) {
      return part ? <span key={i}>{part}</span> : null;
    }
    return (
      <code
        key={i}
        className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800"
      >
        {part}
      </code>
    );
  });
}

function TextSection({ content }: { content: string }): ReactElement {
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="space-y-2.5">
      {lines.map((line, i) => (
        <p key={i} className="leading-relaxed text-gray-700">
          {renderInlineCode(line)}
        </p>
      ))}
    </div>
  );
}

export function BlogStructuredContent({ content }: BlogStructuredContentProps): ReactElement {
  const { isValid, sections } = parseStructuredBlog(content);

  if (!isValid) {
    return <BlogMarkdown content={content} />;
  }

  return (
    <div className="space-y-5">
      {sections.map(({ label, content: sectionContent, type, language }) => {
        if (label === 'Title') return null;

        const accentClass =
          SECTION_LABEL_STYLES[label] ?? 'text-gray-700 bg-gray-50 border-gray-200';

        return (
          <section
            key={label}
            className={`rounded-xl border bg-white p-6 shadow-sm ${accentClass.split(' ').find((c) => c.startsWith('border-')) ?? 'border-gray-200'}`}
          >
            <h2
              className={`mb-4 inline-block rounded-lg px-3 py-1 text-sm font-semibold tracking-wide ${accentClass}`}
            >
              {label}
            </h2>

            {type === 'code' ? (
              <CodeBlock code={sectionContent} language={language} />
            ) : (
              <TextSection content={sectionContent} />
            )}
          </section>
        );
      })}
    </div>
  );
}
