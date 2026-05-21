import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const postsDir = path.resolve(__dirname, '../src/data/posts')
const outputPath = path.resolve(__dirname, '../src/data/posts.json')

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const meta = {}
  const lines = match[1].split('\n')

  for (const line of lines) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue

    const key = line.slice(0, colonIdx).trim()
    let value = line.slice(colonIdx + 1).trim()

    // Parse array: [tag1, tag2]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
    }
    // Parse quoted string
    else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    meta[key] = value
  }

  return meta
}

function generateSlug(filename) {
  return filename.replace(/\.md$/, '')
}

function countWords(text) {
  // Strip HTML tags, then count
  const stripped = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return stripped ? stripped.split(/\s+/).length : 0
}

function generate() {
  if (!fs.existsSync(postsDir)) {
    console.error(`Posts directory not found: ${postsDir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
  const posts = []

  for (const file of files) {
    const filePath = path.join(postsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const meta = parseFrontmatter(content)
    const slug = generateSlug(file)

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

generate()
