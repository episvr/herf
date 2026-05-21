const colors = {
  reset: '\x1b[39m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
}

function colorize(color, text) {
  return `${colors[color]}${text}${colors.reset}`
}

export const log = {
  info(msg) {
    console.log(`${colorize('green', 'INFO')}  ${msg}`)
  },

  warn(msg) {
    console.log(`${colorize('yellow', 'WARN')}  ${msg}`)
  },

  error(msg) {
    console.error(`${colorize('red', 'ERROR')} ${msg}`)
  },

  debug(msg) {
    if (process.env.HERF_DEBUG) {
      console.log(`${colorize('gray', 'DEBUG')} ${msg}`)
    }
  },

  success(msg) {
    console.log(`${colorize('green', 'INFO')}  ${msg}`)
  },

  // Colored helpers
  file(path) {
    return colorize('magenta', path)
  },

  time(ms) {
    return colorize('cyan', `${ms} ms`)
  },

  highlight(text) {
    return colorize('cyan', text)
  },
}
