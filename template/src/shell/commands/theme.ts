import { Command } from './index'

export const themeCmd: Command = {
  name: 'theme',
  description: 'Switch terminal color theme',
  usage: 'theme [green|amber|white]',
  execute: async (cmd) => {
    const color = cmd.args[0]
    const valid = ['green', 'amber', 'white']
    if (!color) {
      return { text: `Current themes: ${valid.join(', ')}\nUsage: theme <color>` }
    }
    if (!valid.includes(color)) {
      return { text: `theme: '${color}' not available. Choose: ${valid.join(', ')}`, error: true }
    }
    document.documentElement.setAttribute('data-theme', color)
    return { text: `Theme set to ${color}.` }
  },
}
