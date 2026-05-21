import { execSync } from 'child_process'
import { generateCommand } from './generate.js'

export async function buildCommand() {
  // Generate index first
  await generateCommand()

  console.log('Building for production...')

  try {
    execSync('npx tsc -b && npx vite build', {
      cwd: process.cwd(),
      stdio: 'inherit'
    })
    console.log('Build complete!')
  } catch (error) {
    console.error('Build failed')
    process.exit(1)
  }
}
