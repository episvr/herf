import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { log } from '../utils/logger.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templateDir = path.resolve(__dirname, '../../template')

export async function initCommand(name) {
  const targetDir = path.resolve(process.cwd(), name)

  if (fs.existsSync(targetDir)) {
    log.error(`Directory "${name}" already exists`)
    process.exit(1)
  }

  log.info(`Creating herf project in ${log.file(targetDir)}...`)

  // Copy template directory
  fs.cpSync(templateDir, targetDir, { recursive: true })

  // Update package.json name and remove tty-blog dependency (not published yet)
  const pkgPath = path.join(targetDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.name = name
  if (pkg.devDependencies && pkg.devDependencies['tty-blog']) {
    delete pkg.devDependencies['tty-blog']
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  // Install dependencies
  log.info('Installing dependencies...')
  execSync('npm install', { cwd: targetDir, stdio: 'inherit' })

  log.success(`Project created!`)
  console.log(`
  cd ${log.highlight(name)}
  herf dev              # Start development server
  herf new "Post Title" # Create a new post
  herf build            # Build for production
`)
}
