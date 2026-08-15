import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { log } from '../utils/logger.mjs'
import { runCommand } from '../utils/runCommand.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const herfRoot = path.resolve(__dirname, '../..')
const templateDir = path.join(herfRoot, 'template')

// Build artifacts and tooling that should never be copied into a new project
const SKIP = new Set(['node_modules', 'dist', '.git', '.claude', '.generate-cache.json', 'tsconfig.tsbuildinfo'])

// When herf is running from a source checkout, link to the local copy so the
// scaffolded project uses the current code. When installed from the registry,
// use a normal semver range.
function herfDevDependency(targetDir) {
  const isSource = !__dirname.split(path.sep).includes('node_modules')
  if (isSource) {
    return `file:${path.relative(targetDir, herfRoot).split(path.sep).join('/')}`
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(herfRoot, 'package.json'), 'utf-8'))
  return `^${pkg.version}`
}

export async function initCommand(name, options = {}) {
  const targetDir = name ? path.resolve(process.cwd(), name) : process.cwd()

  if (name) {
    if (fs.existsSync(targetDir)) {
      throw new Error(`Directory "${name}" already exists`)
    }
  } else {
    if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
      throw new Error('Current directory is not empty. Run "herf init <name>" to create a new project.')
    }
  }

  log.info(`Creating herf project in ${log.file(targetDir)}...`)

  fs.cpSync(templateDir, targetDir, {
    recursive: true,
    filter: (src) => !SKIP.has(path.basename(src)),
  })

  const pkgPath = path.join(targetDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.name = name || path.basename(targetDir)
  pkg.devDependencies = pkg.devDependencies || {}
  delete pkg.devDependencies['tty-blog']
  pkg.devDependencies['@episvr/herf'] = herfDevDependency(targetDir)
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  if (options.skipInstall) {
    log.info(`Run ${log.highlight('npm install')} in ${log.file(name || targetDir)} to install dependencies.`)
  } else {
    log.info('Installing dependencies...')
    await runCommand('npm', ['install'], { cwd: targetDir })
  }

  log.success('Project created!')
  console.log(`
  cd ${log.highlight(name || targetDir)}
  herf dev              # Start development server
  herf new "Post Title" # Create a new post
  herf build            # Build for production
`)
}
