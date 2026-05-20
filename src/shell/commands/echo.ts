import { Command } from './index'

export const echoCmd: Command = {
  name: 'echo',
  description: 'Display text',
  usage: 'echo <text>',
  execute: async (cmd) => {
    return { text: cmd.args.join(' ') }
  },
}
