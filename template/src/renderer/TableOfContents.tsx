import React, { useState, useEffect, useRef } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface Props {
  content: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function TableOfContents({ content }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>('')
  const [items, setItems] = useState<TocItem[]>([])
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lines = content.split('\n')
    const extracted: TocItem[] = []
    let inCodeBlock = false

    for (const line of lines) {
      // Toggle code block state
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock
        continue
      }

      // Skip lines inside code blocks
      if (inCodeBlock) continue

      // Match headings
      const match = line.match(/^(#{1,3})\s+(.+)$/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const id = slugify(text)
        extracted.push({ id, text, level })
      }
    }

    setItems(extracted)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0% -80% 0%' }
    )

    const timer = setTimeout(() => {
      items.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [items])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (items.length === 0) return null

  const activeIndex = items.findIndex(item => item.id === activeId)
  const progress = activeIndex >= 0 ? Math.round(((activeIndex + 1) / items.length) * 100) : 0

  return (
    <div className="toc-wrapper" ref={panelRef}>
      <button className="toc-trigger" onClick={() => setIsOpen(!isOpen)} title="目录">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="toc-trigger-text">{progress}%</span>
      </button>

      {isOpen && (
        <div className="toc-panel">
          <div className="toc-header">
            <span className="toc-title">目录</span>
            <span className="toc-count">{items.length} 项</span>
          </div>
          <nav className="toc-nav">
            {items.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`toc-link toc-level-${item.level} ${
                  activeId === item.id ? 'toc-active' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById(item.id)
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' })
                    setActiveId(item.id)
                  }
                }}
              >
                <span className="toc-link-dot" />
                <span className="toc-link-text">{item.text}</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
