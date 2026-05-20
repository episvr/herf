import { Command } from './index'

export const pwdCmd: Command = {
  name: 'pwd',
  description: 'Print current directory',
  usage: 'pwd',
  execute: async (_cmd, ctx) => {
    const path = ctx.cwd === '~' ? '~' : `~/${ctx.cwd}`
    return { text: path }
  },
}
