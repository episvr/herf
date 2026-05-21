import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useTerminal, OutputLine } from './useTerminal'
import { parseCommand } from './commandParser'
import { commands } from './commands'
import { getPosts } from '../data/loader'
import { config } from '../config'

export function Terminal() {
  const {
    output,
    history,
    historyIdx,
    setHistoryIdx,
    cwd,
    executeCommand,
    scrollRef,
    scrollBottom,
    clearOutput,
  } = useTerminal()

  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [initialized, setInitialized] = useState(false)

  // Show welcome message on mount
  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
    }
  }, [initialized])

  // Scroll on new output
  useEffect(() => {
    scrollBottom()
  }, [output, scrollBottom])

  // Focus input on click anywhere
  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    focusInput()
  }, [focusInput])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = input
    setInput('')
    await executeCommand(cmd)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const newIdx = historyIdx < 0 ? history.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(newIdx)
      setInput(history[newIdx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx < 0) return
      if (historyIdx >= history.length - 1) {
        setHistoryIdx(-1)
        setInput('')
      } else {
        const newIdx = historyIdx + 1
        setHistoryIdx(newIdx)
        setInput(history[newIdx])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      autocomplete()
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      clearOutput()
    }
  }

  const autocomplete = () => {
    const parts = input.split(/\s+/)
    if (parts.length <= 1) {
      // Command name completion
      const partial = parts[0].toLowerCase()
      const matches = Object.keys(commands).filter(c => c.startsWith(partial))
      if (matches.length === 1) {
        setInput(matches[0] + ' ')
      } else if (matches.length > 1) {
        executeCommand(`echo ${matches.join('  ')}`)
      }
    } else {
      // Argument completion
      const cmdName = parts[0]
      const partial = parts[parts.length - 1].toLowerCase()
      const posts = getPosts()

      let candidates: string[] = []

      if (['cat', 'grep', 'wc', 'ppt', 'type'].includes(cmdName)) {
        candidates = posts.flatMap(p => [p.id, String(p.pid)])
      } else if (cmdName === 'cd') {
        candidates = [...new Set(posts.map(p => p.category))]
        candidates.push('~', '..')
      } else if (cmdName === 'theme') {
        candidates = ['green', 'amber', 'white']
      }

      if (candidates.length > 0) {
        const matches = candidates.filter(c => c.toLowerCase().startsWith(partial))
        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0]
          setInput(parts.join(' ') + ' ')
        } else if (matches.length > 1) {
          executeCommand(`echo ${matches.join('  ')}`)
        }
      }
    }
  }

  const promptPath = cwd === '~' ? '~' : `~/${cwd}`

  return (
    <div
      className="h-full flex flex-col bg-terminal-bg text-terminal-green text-glow-green text-sm font-mono crt"
      onClick={focusInput}
    >
      {/* Output area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 terminal-scroll relative z-10"
      >
        {/* Welcome message */}
        {initialized && output.length === 0 && (
          <div className="mb-4">
            <pre className="text-terminal-cyan whitespace-pre-wrap">
              {config.banner}
            </pre>
            {config.site.description && (
              <div className="text-terminal-dim mt-1">  {config.site.description}</div>
            )}
            <div className="text-terminal-dim mt-2">  {config.welcome}</div>
          </div>
        )}

        {/* Command output */}
        {output.map((line) => (
          <OutputRow key={line.id} line={line} promptPath={promptPath} />
        ))}
      </div>

      {/* Input line */}
      <form onSubmit={handleSubmit} className="flex items-center px-4 py-2 border-t border-terminal-dim/30 relative z-10">
        <Prompt path={promptPath} />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-terminal-green text-glow-green ml-1 caret-terminal-green"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  )
}

function Prompt({ path }: { path: string }) {
  const { user, symbol, showPath } = config.prompt
  return (
    <span className="flex-shrink-0 select-none">
      <span className="text-terminal-green">{user}</span>
      <span className="text-terminal-dim">@</span>
      <span className="text-terminal-cyan">{config.site.name}</span>
      <span className="text-terminal-dim">:</span>
      {showPath && <span className="text-terminal-blue">{path}</span>}
      <span className="text-terminal-green">{symbol}</span>
    </span>
  )
}

function OutputRow({ line, promptPath }: { line: OutputLine; promptPath: string }) {
  if (line.type === 'input') {
    return (
      <div className="flex">
        <Prompt path={promptPath} />
        <span className="ml-1 text-terminal-bright">{line.content}</span>
      </div>
    )
  }

  if (line.type === 'component' && line.component) {
    return <div className="my-1">{line.component}</div>
  }

  if (line.type === 'error') {
    return <div className="text-terminal-red">{line.content}</div>
  }

  // Regular output - handle ANSI-like color codes
  if (line.content.includes('\x1b[')) {
    return <div dangerouslySetInnerHTML={{ __html: ansiToHtml(line.content) }} />
  }

  return <div className="whitespace-pre-wrap">{line.content || ' '}</div>
}

// Simple ANSI to HTML converter
function ansiToHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\x1b\[1;31m(.*?)\x1b\[0m/g, '<span style="color:#FF5555;font-weight:bold">$1</span>')
    .replace(/\x1b\[36m(.*?)\x1b\[0m/g, '<span style="color:#00FFFF">$1</span>')
    .replace(/\x1b\[90m(.*?)\x1b\[0m/g, '<span style="color:#666">$1</span>')
    .replace(/\x1b\[33m(.*?)\x1b\[0m/g, '<span style="color:#FFFF55">$1</span>')
    .replace(/\x1b\[32m(.*?)\x1b\[0m/g, '<span style="color:#00FF00">$1</span>')
    .replace(/\x1b\[0m/g, '')
}
