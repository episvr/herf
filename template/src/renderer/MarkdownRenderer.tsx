import React from 'react'
import Markdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import { CodeBlock } from './CodeBlock'
import { PdfSlides } from '../ppt/PdfSlides'
import { AssetCard } from './AssetCard'
import { TableOfContents } from './TableOfContents'
import { PostMeta } from '../data/types'

interface Props {
  content: string
  meta: PostMeta
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

type ContentPart =
  | { type: 'markdown'; content: string }
  | { type: 'pdf'; url: string }
  | { type: 'asset'; url: string; label: string }
  | { type: 'github'; url: string; label: string }

function stripFrontmatter(content: string): string {
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)
  if (match) {
    return content.slice(match[0].length)
  }
  return content
}

export function MarkdownRenderer({ content, meta }: Props) {
  const bodyContent = stripFrontmatter(content)
  const parts = splitContent(bodyContent)

  return (
    <div className="markdown-body">
      <TableOfContents content={bodyContent} />
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
        if (part.type === 'asset') {
          return <AssetCard key={i} url={part.url} label={part.label} type="file" />
        }
        if (part.type === 'github') {
          return <AssetCard key={i} url={part.url} label={part.label} type="github" />
        }
        return (
          <Markdown
            key={i}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1({ children, ...props }) {
                const text = String(children)
                const id = slugify(text)
                return <h1 id={id} {...props}>{children}</h1>
              },
              h2({ children, ...props }) {
                const text = String(children)
                const id = slugify(text)
                return <h2 id={id} {...props}>{children}</h2>
              },
              h3({ children, ...props }) {
                const text = String(children)
                const id = slugify(text)
                return <h3 id={id} {...props}>{children}</h3>
              },
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

// Unified regex for [prefix:url](label) patterns
// Order matters: asset/github matched first, then slides
const ASSET_RE = /\[asset:([^\]]+)\]\(([^)]*)\)/gi
const GITHUB_RE = /\[github:([^\]]+)\]\(([^)]*)\)/gi
const SLIDES_RE = /\[slides\]\(([^)]+\.pdf)\)/gi

// Find ranges that are inside code blocks
function findCodeRanges(content: string): [number, number][] {
  const ranges: [number, number][] = []
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

function splitContent(content: string): ContentPart[] {
  const parts: ContentPart[] = []
  const codeRanges = findCodeRanges(content)

  // Collect all matches with their type and position
  type Match = { index: number; length: number; part: ContentPart }
  const allMatches: Match[] = []

  // Reset regex lastIndex
  ASSET_RE.lastIndex = 0
  GITHUB_RE.lastIndex = 0
  SLIDES_RE.lastIndex = 0

  let m: RegExpExecArray | null

  while ((m = ASSET_RE.exec(content)) !== null) {
    if (!isInCode(m.index, codeRanges)) {
      allMatches.push({
        index: m.index,
        length: m[0].length,
        part: { type: 'asset', url: m[1], label: m[2] },
      })
    }
  }

  while ((m = GITHUB_RE.exec(content)) !== null) {
    if (!isInCode(m.index, codeRanges)) {
      allMatches.push({
        index: m.index,
        length: m[0].length,
        part: { type: 'github', url: m[1], label: m[2] },
      })
    }
  }

  while ((m = SLIDES_RE.exec(content)) !== null) {
    if (!isInCode(m.index, codeRanges)) {
      allMatches.push({
        index: m.index,
        length: m[0].length,
        part: { type: 'pdf', url: m[1] },
      })
    }
  }

  // Sort by position
  allMatches.sort((a, b) => a.index - b.index)

  // Build parts array
  let lastIndex = 0
  for (const match of allMatches) {
    if (match.index < lastIndex) continue // overlapping match, skip
    if (match.index > lastIndex) {
      parts.push({ type: 'markdown', content: content.slice(lastIndex, match.index) })
    }
    parts.push(match.part)
    lastIndex = match.index + match.length
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'markdown', content: content.slice(lastIndex) })
  }

  return parts
}
