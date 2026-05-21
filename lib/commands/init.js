import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templateDir = path.resolve(__dirname, '../../template')

export async function initCommand(name) {
  const targetDir = path.resolve(process.cwd(), name)

  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory "${name}" already exists`)
    process.exit(1)
  }

  console.log(`Creating tty-blog project in ${targetDir}...`)

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
  console.log('Installing dependencies...')
  execSync('npm install', { cwd: targetDir, stdio: 'inherit' })

  console.log(`
Done! Your tty-blog project is ready.

  cd ${name}
  npm run dev       # Start development server
  npm run new "Post Title"  # Create a new post
  npm run build     # Build for production
`)
}
