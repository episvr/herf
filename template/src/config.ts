// Default config
const defaultConfig = {
  site: {
    name: 'herf',
    description: 'A terminal-style blog for developers',
    author: '',
  },
  banner: `
  ██╗  ██╗ ███████╗ ██████╗  ███████╗
  ██║  ██║ ██╔════╝ ██╔══██╗ ██╔════╝
  ███████║ █████╗   ██████╔╝ █████╗
  ██╔══██║ ██╔══╝   ██╔══██╗ ██╔══╝
  ██║  ██║ ███████╗ ██║  ██║ ██║
  ╚═╝  ╚═╝ ╚══════╝ ╚═╝  ╚═╝ ╚═╝`,
  welcome: 'Type "help" to get started.',
  theme: 'green',
  prompt: {
    user: 'guest',
    symbol: '$',
    showPath: true,
  },
}

// User config loaded from blog.config.ts at build time via Vite
// In dev mode, this will be an empty object unless blog.config.ts is imported
let userConfig: any = {}

// Vite injects import.meta.glob for lazy loading
try {
  // This will be resolved by Vite at build time
  const modules = import.meta.glob('/blog.config.ts', { eager: true })
  const mod = modules['/blog.config.ts'] as any
  if (mod) {
    userConfig = mod.default || {}
  }
} catch {
  // No user config
}

export const config = {
  ...defaultConfig,
  ...userConfig,
  site: { ...defaultConfig.site, ...userConfig.site },
  prompt: { ...defaultConfig.prompt, ...userConfig.prompt },
}
