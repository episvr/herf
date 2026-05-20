import { Command, commands } from './index'

export const helpCmd: Command = {
  name: 'help',
  description: 'Show available commands',
  usage: 'help [command]',
  execute: async (cmd) => {
    const target = cmd.args[0]

    if (target) {
      const c = commands[target]
      if (!c) return { text: `help: no help for '${target}'`, error: true }
      return {
        text: [
          `${c.name} - ${c.description}`,
          '',
          `Usage: ${c.usage}`,
        ].join('\n'),
      }
    }

    const lines = [
      '╔══════════════════════════════════════════════╗',
      '║           SHELL BLOG - HELP MENU             ║',
      '╚══════════════════════════════════════════════╝',
      '',
      'Available commands:',
      '',
    ]

    const cmds = Object.values(commands)
      .filter((c, i, arr) => arr.findIndex(x => x.name === c.name) === i)
      .sort((a, b) => a.name.localeCompare(b.name))

    const maxLen = Math.max(...cmds.map(c => c.name.length))
    for (const c of cmds) {
      lines.push(`  ${c.name.padEnd(maxLen + 2)} ${c.description}`)
    }

    lines.push('')
    lines.push('Type "help <command>" for detailed usage.')
    lines.push('Use ↑/↓ arrows to browse command history. Tab for autocomplete.')

    return { text: lines.join('\n') }
  },
}
