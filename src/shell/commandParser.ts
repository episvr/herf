export interface ParsedCommand {
  name: string
  args: string[]
  flags: Record<string, string | boolean>
}

export function parseCommand(input: string): ParsedCommand {
  const tokens = tokenize(input)
  if (tokens.length === 0) {
    return { name: '', args: [], flags: {} }
  }

  const name = tokens[0]
  const args: string[] = []
  const flags: Record<string, string | boolean> = {}

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.startsWith('--')) {
      // Long flag: --key=value or --key
      const eqIdx = token.indexOf('=')
      if (eqIdx > 0) {
        flags[token.slice(2, eqIdx)] = token.slice(eqIdx + 1)
      } else {
        flags[token.slice(2)] = true
      }
    } else if (token.startsWith('-') && token.length > 1) {
      // Short flags: -abc => a=true, b=true, c=true
      for (let j = 1; j < token.length; j++) {
        flags[token[j]] = true
      }
    } else {
      args.push(token)
    }
  }

  return { name, args, flags }
}

function tokenize(input: string): string[] {
  const tokens: string[] = []
  let current = ''
  let inQuote: string | null = null

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (inQuote) {
      if (ch === inQuote) {
        inQuote = null
      } else {
        current += ch
      }
    } else if (ch === '"' || ch === "'") {
      inQuote = ch
    } else if (ch === ' ' || ch === '\t') {
      if (current) {
        tokens.push(current)
        current = ''
      }
    } else {
      current += ch
    }
  }
  if (current) tokens.push(current)
  return tokens
}
