import { Command } from './index'

export const clearCmd: Command = {
  name: 'clear',
  description: 'Clear the terminal',
  usage: 'clear',
  execute: async () => {
    return { clear: true }
  },
}
