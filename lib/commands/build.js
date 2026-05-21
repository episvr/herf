import { execSync, spawn } from 'child_process'
import { generateCommand } from './generate.js'

export async function buildCommand() {
  console.log('Building for production...')

  // Run generate and tsc in parallel
  const generatePromise = generateCommand()
  const tscPromise = new Promise((resolve, reject) => {
    const tsc = spawn('npx', ['tsc', '-b'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true,
    })
    tsc.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`tsc failed with code ${code}`))
    })
  })

  // Wait for both to complete
  await Promise.all([generatePromise, tscPromise])

  // Then run vite build
  try {
    execSync('npx vite build', {
      cwd: process.cwd(),
      stdio: 'inherit'
    })
    console.log('Build complete!')
  } catch (error) {
    console.error('Build failed')
    process.exit(1)
  }
}
