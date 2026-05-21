import fs from 'fs'
import path from 'path'
import { parseFrontmatter } from '../utils/frontmatter.mjs'

const CACHE_FILE = '.generate-cache.json'

function loadCache(cwd) {
  try {
    return JSON.parse(fs.readFileSync(path.join(cwd, CACHE_FILE), 'utf-8'))
  } catch {
    return {}
  }
}

function saveCache(cwd, cache) {
  fs.writeFileSync(path.join(cwd, CACHE_FILE), JSON.stringify(cache), 'utf-8')
}

export async function generateCommand({ force = false } = {}) {
  const postsDir = path.join(process.cwd(), 'src', 'data', 'posts')
  const outputPath = path.join(process.cwd(), 'src', 'data', 'posts.json')

  if (!fs.existsSync(postsDir)) {
    console.error('Error: Not a tty-blog project. Run "tty-blog init <name>" first.')
    process.exit(1)
  }

  const cache = loadCache(process.cwd())
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))

  // Quick check: if no files changed and not forced, skip entirely
  if (!force && cache.files) {
    const currentFiles = files.sort().join(',')
    const cachedFiles = Object.keys(cache.files).sort().join(',')
    const allUnchanged = currentFiles === cachedFiles &&
      files.every(f => {
        const stat = fs.statSync(path.join(postsDir, f))
        return cache.files[f]?.mtime === stat.mtimeMs
      })
    if (allUnchanged) {
      console.log('No posts changed, skipping generate.')
      return
    }
  }

  const posts = []
  const newCache = {}

  for (const file of files) {
    const filePath = path.join(postsDir, file)
    const stat = fs.statSync(filePath)
    const slug = file.replace(/\.md$/, '')

    // Reuse cached data if mtime unchanged
    if (!force && cache.files?.[file]?.mtime === stat.mtimeMs) {
      posts.push(cache.files[file].post)
      newCache[file] = cache.files[file]
      continue
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const meta = parseFrontmatter(content)

    const bodyStart = content.indexOf('---', 3)
    const body = bodyStart !== -1 ? content.slice(bodyStart + 3) : content
    const wordCount = countWords(body)
    const lineCount = body.split('\n').length

    const post = {
      id: slug,
      title: meta.title || slug,
      date: meta.date || new Date().toISOString().slice(0, 10),
      category: meta.category || 'uncategorized',
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      file: file,
      lines: lineCount,
      words: wordCount,
    }

    posts.push(post)
    newCache[file] = { mtime: stat.mtimeMs, post }
  }

  // Sort by date descending
  posts.sort((a, b) => b.date.localeCompare(a.date))

  // Assign pid (1-indexed, newest first)
  posts.forEach((post, i) => {
    post.pid = i + 1
  })

  // Update pid in cache
  for (const post of posts) {
    const file = post.file
    if (newCache[file]) newCache[file].post.pid = post.pid
  }

  // Check if output actually changed
  const newJson = JSON.stringify(posts, null, 2) + '\n'
  let outputChanged = true
  try {
    outputChanged = fs.readFileSync(outputPath, 'utf-8') !== newJson
  } catch {}

  // Always save cache for future incremental runs
  saveCache(process.cwd(), { files: newCache })

  if (outputChanged || force) {
    fs.writeFileSync(outputPath, newJson, 'utf-8')
    console.log(`Generated posts.json with ${posts.length} posts`)
  } else {
    console.log(`posts.json unchanged (${posts.length} posts)`)
  }
}

function countWords(text) {
  const stripped = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return stripped ? stripped.split(/\s+/).length : 0
}
