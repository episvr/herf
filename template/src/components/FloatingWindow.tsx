import React, { useState, useRef, useEffect, useCallback } from 'react'

interface WindowState {
  id: number
  title: string
  content: React.ReactNode
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

let windowId = 0
let topZ = 100

// Global window manager
let addWindowFn: ((win: Omit<WindowState, 'id' | 'zIndex'>) => void) | null = null
let closeWindowFn: ((id: number) => void) | null = null

export function openWindow(title: string, content: React.ReactNode, width = 800, height = 600) {
  const x = Math.min(60 + (windowId % 5) * 30, window.innerWidth - 100)
  const y = Math.min(40 + (windowId % 5) * 30, window.innerHeight - 60)
  addWindowFn?.({ title, content, x, y, width, height })
}

export function WindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([])

  useEffect(() => {
    addWindowFn = (win) => {
      const id = ++windowId
      topZ++
      setWindows(prev => [...prev, { ...win, id, zIndex: topZ }])
    }
    closeWindowFn = (id) => {
      setWindows(prev => prev.filter(w => w.id !== id))
    }
    return () => { addWindowFn = null; closeWindowFn = null }
  }, [])

  const bringToFront = useCallback((id: number) => {
    topZ++
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: topZ } : w))
  }, [])

  const closeWindow = useCallback((id: number) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }, [])

  const updateWindow = useCallback((id: number, updates: Partial<WindowState>) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }, [])

  return (
    <>
      {windows.map(win => (
        <FloatingWindow
          key={win.id}
          window={win}
          onClose={() => closeWindow(win.id)}
          onFocus={() => bringToFront(win.id)}
          onMove={(x, y) => updateWindow(win.id, { x, y })}
          onResize={(w, h) => updateWindow(win.id, { width: w, height: h })}
        />
      ))}
    </>
  )
}

interface FloatingProps {
  window: WindowState
  onClose: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
  onResize: (w: number, h: number) => void
}

function FloatingWindow({ window: win, onClose, onFocus, onMove, onResize }: FloatingProps) {
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null)
  const resizeRef = useRef<{ startX: number; startY: number; winW: number; winH: number } | null>(null)

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    onFocus()
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y }

    const handleMove = (e: MouseEvent) => {
      if (!dragRef.current) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      // Keep at least 60px of the title bar visible
      const minX = -(win.width - 60)
      const minY = 0
      const maxX = window.innerWidth - 60
      const maxY = window.innerHeight - 30
      const x = Math.max(minX, Math.min(maxX, dragRef.current.winX + dx))
      const y = Math.max(minY, Math.min(maxY, dragRef.current.winY + dy))
      onMove(x, y)
    }

    const handleUp = () => {
      dragRef.current = null
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFocus()
    resizeRef.current = { startX: e.clientX, startY: e.clientY, winW: win.width, winH: win.height }

    const handleMove = (e: MouseEvent) => {
      if (!resizeRef.current) return
      const dx = e.clientX - resizeRef.current.startX
      const dy = e.clientY - resizeRef.current.startY
      onResize(Math.max(300, resizeRef.current.winW + dx), Math.max(200, resizeRef.current.winH + dy))
    }

    const handleUp = () => {
      resizeRef.current = null
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  return (
    <div
      className="fixed flex flex-col rounded-md shadow-2xl overflow-hidden"
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        background: '#1E1E1E',
        border: '1px solid #3C3C3C',
      }}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 py-1.5 cursor-move select-none border-b"
        style={{ background: '#252526', borderColor: '#3C3C3C' }}
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F57' }}></span>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FEBC2E' }}></span>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28C840' }}></span>
          <span className="ml-2 text-sm" style={{ color: '#888', fontFamily: 'inherit' }}>{win.title}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose() }}
          className="text-lg leading-none px-1 cursor-pointer"
          style={{ color: '#888' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FF5F57')}
          onMouseLeave={e => (e.currentTarget.style.color = '#888')}
        >
          ×
        </button>
      </div>

      {/* Content — clean reader mode, no terminal effects */}
      <div className="flex-1 overflow-auto p-6 window-scroll reader-mode" style={{ background: '#1A1A1A', color: '#D4D4D4', fontSize: '14px', lineHeight: '1.7' }}>
        {win.content}
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeStart}
      >
        <svg className="w-4 h-4" style={{ color: '#555' }} viewBox="0 0 16 16">
          <path d="M14 16L16 14M10 16L16 10M6 16L16 6" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  )
}
