import { Command } from './index'
import { getPostContent, getPost } from '../../data/loader'
import { MarkdownRenderer } from '../../renderer/MarkdownRenderer'
import { openWindow } from '../../components/FloatingWindow'
import React from 'react'

export const catCmd: Command = {
  name: 'cat',
  description: 'Display a blog post in a new window',
  usage: 'cat [-p] <post-id|pid>',
  execute: async (cmd) => {
    const id = cmd.args[0]
    if (!id) {
      return { text: 'cat: missing operand. Usage: cat <post-id> or cat -p <pid>', error: true }
    }

    const meta = getPost(id)
    if (!meta) {
      return { text: `cat: '${id}': No such post. Use 'ls' to list available posts.`, error: true }
    }

    const content = await getPostContent(meta.id)
    if (!content) {
      return { text: `cat: '${meta.id}': Failed to load content.`, error: true }
    }

    openWindow(
      `cat ${meta.pid} — ${meta.title}`,
      React.createElement(MarkdownRenderer, { content, meta }),
      850,
      650,
    )

    return { text: `[${meta.pid}] Opening '${meta.title}'...` }
  },
}
