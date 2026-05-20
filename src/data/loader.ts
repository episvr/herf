import { Post, PostMeta } from './types'
import postsIndex from './posts.json'

const markdownFiles = import.meta.glob('./posts/*.md', { query: '?raw', import: 'default' })

const postsData: PostMeta[] = postsIndex.map(p => ({
  ...p,
  lines: 0,
  words: 0,
}))

const contentCache = new Map<string, string>()

export function getPosts(): PostMeta[] {
  return postsData
}

export function getPost(idOrPid: string | number): PostMeta | undefined {
  if (typeof idOrPid === 'number') {
    return postsData.find(p => p.pid === idOrPid)
  }
  // Match by pid (numeric string), id, or title prefix
  const num = parseInt(idOrPid, 10)
  if (!isNaN(num)) {
    return postsData.find(p => p.pid === num)
  }
  return postsData.find(p => p.id === idOrPid || p.title.toLowerCase().startsWith(idOrPid.toLowerCase()))
}

export async function getPostContent(id: string): Promise<string | null> {
  const meta = postsData.find(p => p.id === id)
  if (!meta) return null

  if (contentCache.has(meta.id)) {
    return contentCache.get(meta.id)!
  }

  const loader = markdownFiles[`./posts/${meta.file}`]
  if (!loader) return null

  const content = await loader() as string
  contentCache.set(meta.id, content)

  meta.lines = content.split('\n').length
  meta.words = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().split(/\s+/).length

  return content
}

export function getCategories(): string[] {
  return [...new Set(postsData.map(p => p.category))]
}
