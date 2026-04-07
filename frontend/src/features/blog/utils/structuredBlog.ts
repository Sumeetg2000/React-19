export const SECTION_LABELS = [
  'Title',
  'Overview',
  'Prerequisites',
  'Problem Statement',
  'Concept Explanation',
  'Core API / Syntax',
  'Code Example',
  'Explanation of Code',
  'Real-World Use Case',
  'Performance Impact',
  'When to Use',
  'When NOT to Use',
  'Pros',
  'Cons',
  'Common Mistakes',
  'Best Practices',
  'Conclusion',
] as const;

export type SectionLabel = (typeof SECTION_LABELS)[number];
export type SectionType = 'text' | 'code';

export interface ParsedSection {
  label: SectionLabel;
  content: string;
  type: SectionType;
  language?: string;
}

export interface StructuredBlog {
  isValid: boolean;
  sections: ParsedSection[];
}

const CODE_FENCE_PATTERN = /~~~(\w*)\n([\s\S]*?)~~~/;

function escapeForRegex(label: string): string {
  return label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\//g, '\\/');
}

export function parseStructuredBlog(content: string): StructuredBlog {
  const alternation = SECTION_LABELS.map(escapeForRegex).join('|');
  const labelPattern = new RegExp(`^(${alternation}):`, 'gm');

  const matches: Array<{ label: SectionLabel; index: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = labelPattern.exec(content)) !== null) {
    matches.push({ label: match[1] as SectionLabel, index: match.index });
  }

  if (matches.length < 10) {
    return { isValid: false, sections: [] };
  }

  const sections: ParsedSection[] = [];

  for (let i = 0; i < matches.length; i++) {
    const { label, index } = matches[i];
    const labelEnd = index + label.length + 1; // skip the ':'
    const contentEnd = i + 1 < matches.length ? matches[i + 1].index : content.length;
    const rawContent = content.slice(labelEnd, contentEnd).trim();

    if (label === 'Code Example') {
      const fenceMatch = CODE_FENCE_PATTERN.exec(rawContent);
      if (fenceMatch) {
        sections.push({
          label,
          content: fenceMatch[2].replace(/\n$/, ''),
          language: fenceMatch[1] || 'tsx',
          type: 'code',
        });
      } else {
        sections.push({ label, content: rawContent, type: 'text' });
      }
    } else {
      sections.push({ label, content: rawContent, type: 'text' });
    }
  }

  return { isValid: sections.length >= 10, sections };
}
