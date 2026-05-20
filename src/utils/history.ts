const HISTORY_KEY = 'shell-blog-history'
const MAX_HISTORY = 100

export function loadHistory(): string[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function saveHistory(history: string[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY)))
  } catch {}
}

export function addToHistory(history: string[], cmd: string): string[] {
  if (!cmd.trim()) return history
  const newHistory = [...history, cmd]
  saveHistory(newHistory)
  return newHistory
}
