import { Command } from './index'

export const unameCmd: Command = {
  name: 'uname',
  description: 'System information',
  usage: 'uname [-a]',
  execute: async (cmd) => {
    const ua = navigator.userAgent
    if (cmd.flags.a) {
      return {
        text: `ShellBlog 1.0.0 ${navigator.platform} Browser/${navigator.appName} ${ua}`,
      }
    }
    return { text: 'ShellBlog' }
  },
}
