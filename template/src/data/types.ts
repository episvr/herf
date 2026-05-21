export interface PostMeta {
  pid: number
  id: string
  title: string
  date: string
  category: string
  tags: string[]
  file: string
  lines: number
  words: number
}

export interface Post extends PostMeta {
  content: string
}
