import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Props {
  language?: string
  children: string
}

export function CodeBlock({ language, children }: Props) {
  return (
    <div className="relative my-2">
      {language && (
        <div className="absolute top-0 right-0 px-2 py-0.5 text-xs text-terminal-dim bg-[#1E1E1E] rounded-bl">
          {language}
        </div>
      )}
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '4px',
          border: '1px solid #333',
          fontSize: '0.85em',
          padding: '1em',
        }}
        showLineNumbers={children.split('\n').length > 3}
        lineNumberStyle={{ color: '#555', minWidth: '2em' }}
      >
        {children.trimEnd()}
      </SyntaxHighlighter>
    </div>
  )
}
