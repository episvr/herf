import { Command } from './index'
import { getPostContent, getPosts, getPost } from '../../data/loader'

export const grepCmd: Command = {
  name: 'grep',
  description: 'Search post content',
  usage: 'grep [-i] <pattern> [post-id]',
  execute: async (cmd) => {
    const caseInsensitive = !!cmd.flags.i
    const pattern = cmd.args[0]
    if (!pattern) return { text: 'grep: missing pattern.', error: true }

    const targetId = cmd.args[1]
    const flags = caseInsensitive ? 'gi' : 'g'
    let regex: RegExp
    try {
      regex = new RegExp(pattern, flags)
    } catch {
      return { text: `grep: invalid pattern '${pattern}'`, error: true }
    }

    const searchPosts = targetId
      ? [getPost(targetId)].filter(Boolean)
      : getPosts()

    if (targetId && !getPost(targetId)) {
      return { text: `grep: '${targetId}': No such post.`, error: true }
    }

    const results: string[] = []
    let matchCount = 0

    for (const p of searchPosts!) {
      const content = await getPostContent(p!.id)
      if (!content) continue

      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (regex.test(line)) {
          matchCount++
          // Highlight matches
          const highlighted = line.replace(regex, (m) => `\x1b[1;31m${m}\x1b[0m`)
          results.push(`\x1b[36m${p!.id}\x1b[0m:${i + 1}: ${highlighted}`)
          if (results.length >= 50) break
        }
        regex.lastIndex = 0
      }
      if (results.length >= 50) break
    }

    if (results.length === 0) {
      return { text: `grep: no matches for '${pattern}'` }
    }

    return {
      text: [
        ...results,
        '',
        `(${matchCount} match${matchCount !== 1 ? 'es' : ''}${results.length >= 50 ? ', truncated' : ''})`,
      ].join('\n'),
    }
  },
}
