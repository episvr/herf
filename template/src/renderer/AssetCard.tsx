import React from 'react'

interface Props {
  url: string
  label: string
  type: 'file' | 'github'
}

function getExt(url: string): string {
  const clean = url.split('?')[0].split('#')[0]
  const dot = clean.lastIndexOf('.')
  return dot >= 0 ? clean.slice(dot + 1).toLowerCase() : ''
}

function FileIcon({ ext }: { ext: string }) {
  const color = getIconColor(ext)
  const letter = getIconLetter(ext)

  return (
    <div
      className="asset-card-icon"
      style={{
        background: color,
        color: '#fff',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        fontSize: '0.65rem',
        letterSpacing: '-0.02em',
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  )
}

function GitHubIcon() {
  return (
    <div
      className="asset-card-icon"
      style={{
        background: '#24292e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        flexShrink: 0,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 16 16" fill="#fff">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    </div>
  )
}

export function AssetCard({ url, label, type }: Props) {
  const isExternal = url.startsWith('http://') || url.startsWith('https://')
  const ext = getExt(url)

  const handleClick = (e: React.MouseEvent) => {
    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      // Relative path — open in new tab (browser handles download)
      window.open(url, '_blank')
    }
  }

  const filename = url.split('/').pop() || url

  return (
    <div className="asset-card" onClick={handleClick} title={url}>
      {type === 'github' ? <GitHubIcon /> : <FileIcon ext={ext} />}
      <div className="asset-card-info">
        <span className="asset-card-label">{label || filename}</span>
        <span className="asset-card-meta">
          {type === 'github' ? 'GitHub' : ext ? `.${ext}` : 'file'}
          {isExternal && type !== 'github' && ' · external'}
        </span>
      </div>
      <div className="asset-card-action">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isExternal ? (
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          ) : (
            <>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </>
          )}
        </svg>
      </div>
    </div>
  )
}

function getIconColor(ext: string): string {
  const map: Record<string, string> = {
    pdf: '#E53E3E',
    doc: '#2B6CB0',
    docx: '#2B6CB0',
    xls: '#2F855A',
    xlsx: '#2F855A',
    ppt: '#C05621',
    pptx: '#C05621',
    zip: '#805AD5',
    rar: '#805AD5',
    '7z': '#805AD5',
    tar: '#805AD5',
    gz: '#805AD5',
    png: '#D69E2E',
    jpg: '#D69E2E',
    jpeg: '#D69E2E',
    gif: '#D69E2E',
    svg: '#D69E2E',
    webp: '#D69E2E',
    mp4: '#9F7AEA',
    webm: '#9F7AEA',
    mov: '#9F7AEA',
    mp3: '#ED64A6',
    wav: '#ED64A6',
    ogg: '#ED64A6',
    js: '#ECC94B',
    ts: '#3182CE',
    py: '#38A169',
    go: '#00ADD8',
    rs: '#DEA584',
    cpp: '#00599C',
    c: '#555',
    java: '#ED8B00',
    sh: '#4A5568',
    md: '#718096',
    txt: '#718096',
  }
  return map[ext] || '#4A5568'
}

function getIconLetter(ext: string): string {
  const map: Record<string, string> = {
    pdf: 'PDF',
    doc: 'DOC',
    docx: 'DOC',
    xls: 'XLS',
    xlsx: 'XLS',
    ppt: 'PPT',
    pptx: 'PPT',
    zip: 'ZIP',
    rar: 'RAR',
    '7z': '7Z',
    tar: 'TAR',
    gz: 'GZ',
    png: 'IMG',
    jpg: 'IMG',
    jpeg: 'IMG',
    gif: 'IMG',
    svg: 'SVG',
    webp: 'IMG',
    mp4: 'VID',
    webm: 'VID',
    mov: 'VID',
    mp3: 'AUD',
    wav: 'AUD',
    ogg: 'AUD',
    js: 'JS',
    ts: 'TS',
    py: 'PY',
    go: 'GO',
    rs: 'RS',
    cpp: 'C++',
    c: 'C',
    java: 'JV',
    sh: 'SH',
    md: 'MD',
    txt: 'TXT',
  }
  return map[ext] || 'FILE'
}
