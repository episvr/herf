import { Command } from './index'
import { getPosts } from '../../data/loader'

export const sortCmd: Command = {
  name: 'sort',
  description: 'Sort posts by field',
  usage: 'sort [-r] [-k title|date|id]',
  execute: async (cmd) => {
    const reverse = !!cmd.flags.r
    const field = (cmd.flags.k as string) || 'id'

    const validFields = ['id', 'title', 'date']
    if (!validFields.includes(field)) {
      return { text: `sort: invalid field '${field}'. Use: id, title, date`, error: true }
    }

    const posts = [...getPosts()]
    posts.sort((a, b) => {
      const va = a[field as keyof typeof a] as string
      const vb = b[field as keyof typeof b] as string
      return va.localeCompare(vb)
    })

    if (reverse) posts.reverse()

    const maxLen = Math.max(...posts.map(p => p.id.length))
    const lines = posts.map(p => `  ${p.id.padEnd(maxLen + 2)} ${p.date}  ${p.title}`)

    return {
      text: [
        `Posts sorted by ${field}${reverse ? ' (reverse)' : ''}:`,
        '',
        ...lines,
      ].join('\n'),
    }
  },
}
