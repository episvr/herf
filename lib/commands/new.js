import fs from 'fs'
import path from 'path'
import { generateCommand } from './generate.js'
import { log } from '../utils/logger.mjs'

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function newCommand(title, options) {
  const postsDir = path.join(process.cwd(), 'src', 'data', 'posts')

  if (!fs.existsSync(postsDir)) {
    log.error('Not a herf project. Run "herf init <name>" first.')
    process.exit(1)
  }

  const slug = slugify(title)
  const filePath = path.join(postsDir, `${slug}.md`)

  if (fs.existsSync(filePath)) {
    log.error(`Post "${slug}" already exists`)
    process.exit(1)
  }

  const today = new Date().toISOString().slice(0, 10)
  const displayTitle = title.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const category = options.category || 'tech'
  const tags = options.tags ? options.tags.split(',').map(t => t.trim()) : []

  const template = `---
title: ${displayTitle}
date: ${today}
category: ${category}
tags: [${tags.join(', ')}]
---

# ${displayTitle}

Write your content here...
`

  fs.writeFileSync(filePath, template, 'utf-8')
  log.info(`Created: ${log.file(filePath)}`)

  // Generate index
  await generateCommand()
}
