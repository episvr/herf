import { execSync } from 'child_process'
import { generateCommand } from './generate.js'

export async function devCommand(options) {
  // Generate index first
  await generateCommand()

  const port = options.port || '5173'

  console.log(`Starting dev server on port ${port}...`)

  try {
    execSync(`npx vite --port ${port}`, {
      cwd: process.cwd(),
      stdio: 'inherit'
    })
  } catch (error) {
    // Vite exits with SIGINT, that's ok
    if (error.signal !== 'SIGINT') {
      console.error('Failed to start dev server')
      process.exit(1)
    }
  }
}
