import { ParsedCommand } from '../commandParser'
import { helpCmd } from './help'
import { lsCmd } from './ls'
import { catCmd } from './cat'
import { clearCmd } from './clear'
import { whoamiCmd } from './whoami'
import { wcCmd } from './wc'
import { sortCmd } from './sort'
import { grepCmd } from './grep'
import { cdCmd } from './cd'
import { pwdCmd } from './pwd'
import { echoCmd } from './echo'
import { dateCmd } from './date'
import { unameCmd } from './uname'
import { historyCmd } from './history'
import { themeCmd } from './theme'

export interface CommandContext {
  cwd: string
  setCwd: (cwd: string) => void
  clearOutput: () => void
}

export interface CommandResult {
  text?: string
  error?: boolean
  clear?: boolean
  component?: React.ReactNode
}

export interface Command {
  name: string
  description: string
  usage: string
  execute: (cmd: ParsedCommand, ctx: CommandContext) => Promise<CommandResult>
}

export const commands: Record<string, Command> = {}

function register(cmd: Command) {
  commands[cmd.name] = cmd
}

register(helpCmd)
register(lsCmd)
register(catCmd)
register(clearCmd)
register(whoamiCmd)
register(wcCmd)
register(sortCmd)
register(grepCmd)
register(cdCmd)
register(pwdCmd)
register(echoCmd)
register(dateCmd)
register(unameCmd)
register(historyCmd)
register(themeCmd)

// Aliases
commands['man'] = commands['help']
commands['dir'] = commands['ls']
commands['type'] = commands['cat']
commands['cls'] = commands['clear']
commands['ppt'] = commands['cat']
