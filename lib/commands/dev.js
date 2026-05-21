import { execSync } from 'child_process'
import { generateCommand } from './generate.js'
import { log } from '../utils/logger.mjs'

export async function devCommand(options) {
  // Generate index first
  await generateCommand()

  const port = options.port || '5173'

  log.info(`Starting dev server on port ${log.highlight(port)}...`)

  try {
    execSync(`npx vite --port ${port}`, {
      cwd: process.cwd(),
      stdio: 'inherit'
    })
  } catch (error) {
    // Vite exits with SIGINT, that's ok
    if (error.signal !== 'SIGINT') {
      log.error('Failed to start dev server')
      process.exit(1)
    }
  }
}
