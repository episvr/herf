import { Command } from './index'
import { getPosts, getCategories } from '../../data/loader'

export const lsCmd: Command = {
  name: 'ls',
  description: 'List blog posts',
  usage: 'ls [-l] [-t] [category]',
  execute: async (cmd, ctx) => {
    const long = !!cmd.flags.l
    const sortByDate = !!cmd.flags.t
    const category = cmd.args[0]

    let posts = getPosts()

    // Filter by category or cwd
    const filterCat = category || (ctx.cwd !== '~' ? ctx.cwd : null)
    if (filterCat) {
      posts = posts.filter(p => p.category === filterCat)
      if (posts.length === 0) {
        // Check if it's a valid category
        const cats = getCategories()
        if (!cats.includes(filterCat)) {
          return { text: `ls: '${filterCat}' is not a valid category. Use 'cd' to see categories.`, error: true }
        }
        return { text: `(no posts in category '${filterCat}')` }
      }
    }

    // Sort
    if (sortByDate) {
      posts.sort((a, b) => b.date.localeCompare(a.date))
    } else {
      posts.sort((a, b) => a.id.localeCompare(b.id))
    }

    if (posts.length === 0) {
      return { text: '(no posts found)' }
    }

    if (long) {
      const lines = [
        `total ${posts.length} posts`,
        '',
        'PID   MODE       DATE         LINES  ID                 TITLE',
        '─'.repeat(75),
      ]
      for (const p of posts) {
        const mode = '-rw-r--r--'
        const lines_ = String(p.lines || '?').padStart(5)
        const id = p.id.padEnd(18)
        lines.push(`${String(p.pid).padEnd(5)} ${mode}  ${p.date}  ${lines_}  ${id} ${p.title}`)
      }
      return { text: lines.join('\n') }
    }

    // Short format: colorized list with PID
    const items = posts.map(p => {
      const tags = p.tags.map(t => `\x1b[90m[${t}]\x1b[0m`).join(' ')
      return `  \x1b[33m${String(p.pid).padStart(3)}\x1b[0m  \x1b[36m${p.id}\x1b[0m  ${p.date}  ${tags}`
    })

    return {
      text: [
        `Posts${filterCat ? ` in '${filterCat}'` : ''}:`,
        '',
        '  PID  ID                 DATE        TAGS',
        '─'.repeat(55),
        ...items,
        '',
        `(${posts.length} post${posts.length !== 1 ? 's' : ''})`,
        'Use "cat <id>" or "cat -p <pid>" to read.',
      ].join('\n'),
    }
  },
}
