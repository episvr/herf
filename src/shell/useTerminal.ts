import { useState, useCallback, useRef } from 'react'
import { addToHistory, loadHistory } from '../utils/history'
import { parseCommand } from './commandParser'
import { commands } from './commands'

export interface OutputLine {
  id: number
  type: 'input' | 'output' | 'error' | 'component'
  content: string
  component?: React.ReactNode
}

let nextId = 0

export function useTerminal() {
  const [output, setOutput] = useState<OutputLine[]>([])
  const [history, setHistory] = useState<string[]>(loadHistory)
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [cwd, setCwd] = useState('~')
  const scrollRef = useRef<HTMLDivElement>(null)

  const addOutput = useCallback((line: Omit<OutputLine, 'id'>) => {
    setOutput(prev => [...prev, { ...line, id: nextId++ }])
  }, [])

  const clearOutput = useCallback(() => {
    setOutput([])
  }, [])

  const executeCommand = useCallback(async (input: string) => {
    const trimmed = input.trim()
    if (!trimmed) return

    // Add to history
    setHistory(prev => addToHistory(prev, trimmed))
    setHistoryIdx(-1)

    // Echo the command
    addOutput({ type: 'input', content: trimmed })

    const parsed = parseCommand(trimmed)
    if (!parsed.name) return

    const cmd = commands[parsed.name]
    if (!cmd) {
      addOutput({
        type: 'error',
        content: `command not found: ${parsed.name}. Type 'help' for available commands.`,
      })
      return
    }

    try {
      const result = await cmd.execute(parsed, { cwd, setCwd, clearOutput })
      if (result.clear) {
        clearOutput()
        return
      }
      if (result.component) {
        addOutput({ type: 'component', content: '', component: result.component })
      }
      if (result.text) {
        const lines = result.text.split('\n')
        for (const line of lines) {
          addOutput({ type: result.error ? 'error' : 'output', content: line })
        }
      }
    } catch (err: any) {
      addOutput({ type: 'error', content: `Error: ${err.message}` })
    }
  }, [cwd, addOutput, clearOutput])

  const scrollBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 50)
  }, [])

  return {
    output,
    history,
    historyIdx,
    setHistoryIdx,
    cwd,
    executeCommand,
    scrollRef,
    scrollBottom,
    clearOutput,
  }
}
