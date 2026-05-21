import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const postsDir = path.resolve(__dirname, '../src/data/posts')

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function createPost(titleOrSlug) {
  const slug = slugify(titleOrSlug)
  const filePath = path.join(postsDir, `${slug}.md`)

  if (fs.existsSync(filePath)) {
    console.error(`Post already exists: ${filePath}`)
    process.exit(1)
  }

  const today = new Date().toISOString().slice(0, 10)
  const title = titleOrSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  const template = `---
title: ${title}
date: ${today}
category: tech
tags: []
---

# ${title}

Write your content here...
`

  fs.writeFileSync(filePath, template, 'utf-8')
  console.log(`Created: ${filePath}`)

  // Run generate to update index
  console.log('Updating posts.json...')
  const { execSync } = await import('child_process')
  execSync('node scripts/generate-index.mjs', { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' })
}

const args = process.argv.slice(2)
if (args.length === 0) {
  console.log('Usage: npm run new "Post Title"')
  console.log('   or: npm run new post-slug')
  process.exit(1)
}

await createPost(args[0])
