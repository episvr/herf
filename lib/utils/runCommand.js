import { spawn } from 'child_process'

/**
 * Run a shell command via spawn with a Promise interface.
 * @param {string} cmd - Command to run (e.g. 'npx')
 * @param {string[]} args - Arguments
 * @param {object} [options] - Extra spawn options
 * @param {object} [hooks] - Optional lifecycle hooks
 * @param {function} [hooks.onClose] - Custom close handler (code, signal) => void. Return true to resolve.
 * @returns {Promise<void>}
 */
export function runCommand(cmd, args, options = {}, hooks = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true,
      ...options,
    })

    child.on('close', (code, signal) => {
      if (hooks.onClose) {
        const result = hooks.onClose(code, signal)
        if (result === true) { resolve(); return }
        if (result === false) { reject(new Error(`${cmd} exited with code ${code}`)); return }
      }
      if (code === 0) resolve()
      else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`))
    })

    child.on('error', reject)
  })
}
