import { Command } from './index'
import { getPostContent, getPost, getPosts } from '../../data/loader'

export const wcCmd: Command = {
  name: 'wc',
  description: 'Word count for posts',
  usage: 'wc [-l] [-w] [-c] [post-id]',
  execute: async (cmd) => {
    const showLines = !cmd.flags.l && !cmd.flags.w && !cmd.flags.c || !!cmd.flags.l
    const showWords = !cmd.flags.l && !cmd.flags.w && !cmd.flags.c || !!cmd.flags.w
    const showChars = !cmd.flags.l && !cmd.flags.w && !cmd.flags.c || !!cmd.flags.c
    const all = !cmd.flags.l && !cmd.flags.w && !cmd.flags.c

    const id = cmd.args[0]

    if (!id) {
      // Show stats for all posts
      const posts = getPosts()
      const lines = ['             LINES  WORDS  CHARS  ID']
      let totalLines = 0, totalWords = 0, totalChars = 0

      for (const p of posts) {
        const content = await getPostContent(p.id)
        if (!content) continue
        const l = content.split('\n').length
        const w = content.replace(/[#*`\[\]()!]/g, '').split(/\s+/).filter(Boolean).length
        const ch = content.length
        totalLines += l
        totalWords += w
        totalChars += ch
        lines.push(`${String(l).padStart(12)}  ${String(w).padStart(5)}  ${String(ch).padStart(6)}  ${p.id}`)
      }
      lines.push(`${String(totalLines).padStart(12)}  ${String(totalWords).padStart(5)}  ${String(totalChars).padStart(6)}  total`)
      return { text: lines.join('\n') }
    }

    const meta = getPost(id)
    if (!meta) return { text: `wc: '${id}': No such post.`, error: true }

    const content = await getPostContent(meta.id)
    if (!content) return { text: `wc: '${meta.id}': Failed to load.`, error: true }

    const lines_ = content.split('\n').length
    const words = content.replace(/[#*`\[\]()!]/g, '').split(/\s+/).filter(Boolean).length
    const chars = content.length

    const parts: string[] = []
    if (all || showLines) parts.push(`${lines_} lines`)
    if (all || showWords) parts.push(`${words} words`)
    if (all || showChars) parts.push(`${chars} chars`)

    return { text: `${parts.join(', ')} — ${meta.title}` }
  },
}
