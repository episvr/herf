// Default config
const defaultConfig = {
  site: {
    name: 'tty-blog',
    description: 'Terminal-style blog for developers',
    author: '',
  },
  banner: `
  ████████╗████████╗██╗   ██╗      ██████╗ ██╗      ██████╗  ██████╗
  ╚══██╔══╝╚══██╔══╝╚██╗ ██╔╝      ██╔══██╗██║     ██╔═══██╗██╔════╝
     ██║      ██║    ╚████╔╝ █████╗██████╔╝██║     ██║   ██║██║  ███╗
     ██║      ██║     ╚██╔╝  ╚════╝██╔══██╗██║     ██║   ██║██║   ██║
     ██║      ██║      ██║         ██████╔╝███████╗╚██████╔╝╚██████╔╝
     ╚═╝      ╚═╝      ╚═╝         ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝`,
  welcome: 'Type "help" to get started.',
  theme: 'green',
  prompt: {
    user: 'guest',
    symbol: '$',
    showPath: true,
  },
}

// Try to import user config
let userConfig: any = {}
try {
  const mod = await import('../blog.config.ts')
  userConfig = mod.default || {}
} catch {
  // No user config, use defaults
}

export const config = {
  ...defaultConfig,
  ...userConfig,
  site: { ...defaultConfig.site, ...userConfig.site },
  prompt: { ...defaultConfig.prompt, ...userConfig.prompt },
}
