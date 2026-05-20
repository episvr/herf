import React from 'react'
import Markdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import { CodeBlock } from './CodeBlock'
import { PdfSlides } from '../ppt/PdfSlides'
import { PostMeta } from '../data/types'

interface Props {
  content: string
  meta: PostMeta
}

export function MarkdownRenderer({ content, meta }: Props) {
  // Split content by PDF link references
  const parts = splitBySlides(content)

  return (
    <div className="markdown-body">
      <div className="border-b border-terminal-dim pb-2 mb-3">
        <span className="text-terminal-cyan text-lg">{meta.title}</span>
        <span className="text-terminal-dim ml-3 text-sm">{meta.date}</span>
        <span className="text-terminal-dim ml-3 text-sm">
          [{meta.tags.map(t => t).join(', ')}]
        </span>
      </div>
      {parts.map((part, i) => {
        if (part.type === 'pdf') {
          return <PdfSlides key={i} url={part.url} />
        }
        return (
          <Markdown
            key={i}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                const isBlock = String(children).includes('\n')
                if (isBlock || match) {
                  return (
                    <CodeBlock language={match?.[1]}>
                      {String(children).replace(/\n$/, '')}
                    </CodeBlock>
                  )
                }
                return <code className={className} {...props}>{children}</code>
              },
            }}
          >
            {part.content}
          </Markdown>
        )
      })}
      <div className="border-t border-terminal-dim pt-2 mt-3 text-terminal-dim text-xs">
        — EOF —
      </div>
    </div>
  )
}

type ContentPart =
  | { type: 'markdown'; content: string }
  | { type: 'pdf'; url: string }

// Matches [slides](path/to/file.pdf) or [any-text](path/to/file.pdf)
const PDF_LINK_RE = /\[(?:slides|[^\]]*)\]\(([^)]+\.pdf)\)/gi

// Find ranges that are inside code blocks (``` ... ``` or ` ... `)
function findCodeRanges(content: string): [number, number][] {
  const ranges: [number, number][] = []
  // Fenced code blocks ```...```
  const fence = /^```/gm
  let fenceStart: number | null = null
  let m: RegExpExecArray | null
  while ((m = fence.exec(content)) !== null) {
    if (fenceStart === null) {
      fenceStart = m.index
    } else {
      ranges.push([fenceStart, m.index + m[0].length])
      fenceStart = null
    }
  }
  // Inline code `...` (skip if inside fenced block)
  const inline = /`([^`\n]+)`/g
  while ((m = inline.exec(content)) !== null) {
    const insideFence = ranges.some(([s, e]) => m!.index >= s && m!.index < e)
    if (!insideFence) {
      ranges.push([m.index, m.index + m[0].length])
    }
  }
  return ranges
}

function isInCode(index: number, ranges: [number, number][]): boolean {
  return ranges.some(([s, e]) => index >= s && index < e)
}

function splitBySlides(content: string): ContentPart[] {
  const parts: ContentPart[] = []
  const codeRanges = findCodeRanges(content)
  let lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = PDF_LINK_RE.exec(content)) !== null) {
    // Skip matches inside code blocks
    if (isInCode(match.index, codeRanges)) continue

    if (match.index > lastIndex) {
      parts.push({ type: 'markdown', content: content.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'pdf', url: match[1] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'markdown', content: content.slice(lastIndex) })
  }

  return parts
}
