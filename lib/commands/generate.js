import fs from 'fs'
import path from 'path'
import { parseFrontmatter } from '../utils/frontmatter.mjs'

export async function generateCommand() {
  const postsDir = path.join(process.cwd(), 'src', 'data', 'posts')
  const outputPath = path.join(process.cwd(), 'src', 'data', 'posts.json')

  if (!fs.existsSync(postsDir)) {
    console.error('Error: Not a tty-blog project. Run "tty-blog init <name>" first.')
    process.exit(1)
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
  const posts = []

  for (const file of files) {
    const filePath = path.join(postsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const meta = parseFrontmatter(content)
    const slug = file.replace(/\.md$/, '')

    // Calculate word count from content after frontmatter
    const bodyStart = content.indexOf('---', 3)
    const body = bodyStart !== -1 ? content.slice(bodyStart + 3) : content
    const wordCount = countWords(body)
    const lineCount = body.split('\n').length

    posts.push({
      id: slug,
      title: meta.title || slug,
      date: meta.date || new Date().toISOString().slice(0, 10),
      category: meta.category || 'uncategorized',
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      file: file,
      lines: lineCount,
      words: wordCount,
    })
  }

  // Sort by date descending
  posts.sort((a, b) => b.date.localeCompare(a.date))

  // Assign pid (1-indexed, newest first)
  posts.forEach((post, i) => {
    post.pid = i + 1
  })

  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2) + '\n', 'utf-8')
  console.log(`Generated posts.json with ${posts.length} posts`)
}

function countWords(text) {
  const stripped = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return stripped ? stripped.split(/\s+/).length : 0
}
