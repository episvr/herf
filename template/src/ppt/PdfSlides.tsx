import React, { useEffect, useRef, useState } from 'react'
import Reveal from 'reveal.js'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

interface Props {
  url: string
}

export function PdfSlides({ url }: Props) {
  const [pages, setPages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [aspectRatio, setAspectRatio] = useState(16 / 9)
  const deckRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<Reveal.Api | null>(null)

  // Load PDF and render pages to images
  useEffect(() => {
    let cancelled = false

    async function loadPdf() {
      try {
        setLoading(true)
        setError(null)

        const pdf = await pdfjsLib.getDocument(url).promise
        const imageUrls: string[] = []

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return

          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 2 })

          // Capture aspect ratio from first page
          if (i === 1) {
            setAspectRatio(viewport.width / viewport.height)
          }

          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext('2d')!

          await page.render({ canvasContext: ctx, canvas, viewport }).promise

          imageUrls.push(canvas.toDataURL('image/png'))
        }

        if (!cancelled) {
          setPages(imageUrls)
          setLoading(false)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(`Failed to load PDF: ${err.message}`)
          setLoading(false)
        }
      }
    }

    loadPdf()
    return () => { cancelled = true }
  }, [url])

  // Init reveal.js once pages are loaded
  useEffect(() => {
    if (pages.length === 0 || !deckRef.current || revealRef.current) return

    const container = deckRef.current
    const w = container.clientWidth
    const h = Math.round(w / aspectRatio)

    const deck = new Reveal(container, {
      embedded: true,
      keyboardCondition: 'focused',
      controls: true,
      progress: false,
      center: true,
      transition: 'slide',
      width: w,
      height: h,
      margin: 0.02,
      hash: false,
    })

    deck.initialize().then(() => {
      revealRef.current = deck
      deck.on('slidechanged', (e: any) => {
        setCurrentSlide(e.indexh)
      })
      // Sync size after init
      deck.layout()
    })

    return () => {
      if (revealRef.current) {
        revealRef.current.destroy()
        revealRef.current = null
      }
    }
  }, [pages, aspectRatio])

  // Resize handler
  useEffect(() => {
    if (!deckRef.current || !revealRef.current) return

    const observer = new ResizeObserver(() => {
      if (revealRef.current) {
        const w = deckRef.current!.clientWidth
        const h = Math.round(w / aspectRatio)
        revealRef.current.configure({ width: w, height: h })
        revealRef.current.layout()
      }
    })

    observer.observe(deckRef.current)
    return () => observer.disconnect()
  }, [aspectRatio, pages])

  if (loading) {
    return (
      <div className="my-3 p-4 rounded" style={{ background: '#252526', color: '#888', border: '1px solid #3C3C3C' }}>
        Loading PDF... <span className="animate-pulse">█</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-3 p-4 rounded" style={{ background: '#252526', color: '#FF5555', border: '1px solid #3C3C3C' }}>
        {error}
      </div>
    )
  }

  return (
    <div className="my-3 rounded overflow-hidden" style={{ border: '1px solid #3C3C3C' }}>
      <div className="flex items-center justify-between px-3 py-1 text-xs" style={{ background: '#252526', color: '#888' }}>
        <span>PDF SLIDES ({currentSlide + 1}/{pages.length})</span>
        <span style={{ color: '#6A9955' }}>← → navigate</span>
      </div>
      <div
        ref={deckRef}
        className="reveal"
        style={{ aspectRatio: `${aspectRatio}`, width: '100%', background: '#000' }}
      >
        <div className="slides">
          {pages.map((imgSrc, i) => (
            <section key={i}>
              <img
                src={imgSrc}
                alt={`Page ${i + 1}`}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
