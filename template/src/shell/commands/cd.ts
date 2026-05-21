import { Command } from './index'
import { getCategories } from '../../data/loader'

export const cdCmd: Command = {
  name: 'cd',
  description: 'Change category directory',
  usage: 'cd [category|..|~]',
  execute: async (cmd, ctx) => {
    const target = cmd.args[0] || '~'

    if (target === '~' || target === '/') {
      ctx.setCwd('~')
      return { text: '' }
    }

    if (target === '..') {
      ctx.setCwd('~')
      return { text: '' }
    }

    const cats = getCategories()
    if (cats.includes(target)) {
      ctx.setCwd(target)
      return { text: '' }
    }

    return {
      text: `cd: '${target}': No such category.\nAvailable: ${cats.join(', ')}`,
      error: true,
    }
  },
}
