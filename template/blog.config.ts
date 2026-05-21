export default {
  // Site info
  site: {
    name: 'herf',
    description: 'A terminal-style blog for developers',
    author: '',
  },

  // Welcome banner (ASCII art or text)
  banner: `
  ██╗  ██╗███████╗██████╗ ███████╗
  ██║  ██║██╔════╝██╔══██╗██╔════╝
  ███████║█████╗  ██████╔╝█████╗
  ██╔══██║██╔══╝  ██╔══██╗██╔══╝
  ██║  ██║███████╗██║  ██║██║
  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝`,

  // Welcome message (shown below banner)
  welcome: 'Type "help" to get started.',

  // Terminal theme: 'green' | 'amber' | 'white'
  theme: 'green',

  // Prompt style
  prompt: {
    user: 'guest',
    symbol: '$',
    showPath: true,
  },
}
