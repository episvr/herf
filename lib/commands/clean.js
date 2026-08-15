import fs from 'fs'
import path from 'path'
import { log } from '../utils/logger.mjs'

export async function cleanCommand() {
  const cwd = process.cwd()
  const targets = [
    '.generate-cache.json',
    'dist',
    path.join('src', 'data', 'posts.json'),
  ]

  let removed = 0
  for (const target of targets) {
    const filePath = path.join(cwd, target)
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, { recursive: true, force: true })
      log.info(`Removed ${log.file(target)}`)
      removed++
    }
  }

  if (removed === 0) {
    log.info('Nothing to clean.')
  } else {
    log.success('Clean complete!')
  }
}
