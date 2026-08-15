import { generateCommand } from './generate.js'
import { log } from '../utils/logger.mjs'
import { runCommand } from '../utils/runCommand.js'

export async function buildCommand() {
  log.info('Building for production (full build)...')
  const totalStart = Date.now()

  // Production builds must not reuse stale post or TypeScript caches.
  const generatePromise = generateCommand({ force: true })
  const tscPromise = (async () => {
    const tscStart = Date.now()
    await runCommand('npx', ['tsc', '-b', '--force'])
    log.info(`TypeScript compiled in ${log.time(Date.now() - tscStart)}`)
  })()

  await Promise.all([generatePromise, tscPromise])

  // Then run vite build
  const viteStart = Date.now()
  await runCommand('npx', ['vite', 'build'])
  log.info(`Vite built in ${log.time(Date.now() - viteStart)}`)
  log.success(`Build complete! ${log.time(Date.now() - totalStart)}`)
}
