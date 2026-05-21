import { Command } from './index'
import { loadHistory } from '../../utils/history'

export const historyCmd: Command = {
  name: 'history',
  description: 'Show command history',
  usage: 'history',
  execute: async () => {
    const h = loadHistory()
    if (h.length === 0) return { text: '(no history)' }
    const lines = h.map((cmd, i) => `  ${String(i + 1).padStart(4)}  ${cmd}`)
    return { text: lines.join('\n') }
  },
}
