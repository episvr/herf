import { execSync, spawn } from 'child_process'
import { generateCommand } from './generate.js'
import { log } from '../utils/logger.mjs'

export async function buildCommand() {
  log.info('Building for production...')
  const totalStart = Date.now()

  // Run generate and tsc in parallel
  const generatePromise = generateCommand()
  const tscPromise = new Promise((resolve, reject) => {
    const tscStart = Date.now()
    const tsc = spawn('npx', ['tsc', '-b'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true,
    })
    tsc.on('close', (code) => {
      if (code === 0) {
        log.info(`TypeScript compiled in ${log.time(Date.now() - tscStart)}`)
        resolve()
      } else {
        reject(new Error(`tsc failed with code ${code}`))
      }
    })
  })

  // Wait for both to complete
  await Promise.all([generatePromise, tscPromise])

  // Then run vite build
  const viteStart = Date.now()
  try {
    execSync('npx vite build', {
      cwd: process.cwd(),
      stdio: 'inherit'
    })
    log.info(`Vite built in ${log.time(Date.now() - viteStart)}`)
    log.success(`Build complete! ${log.time(Date.now() - totalStart)}`)
  } catch (error) {
    log.error('Build failed')
    process.exit(1)
  }
}
