import { Command } from './index'

export const whoamiCmd: Command = {
  name: 'whoami',
  description: 'About the blog author',
  usage: 'whoami',
  execute: async () => {
    return {
      text: [
        '╔══════════════════════════════════════════════╗',
        '║                  SHELL BLOG                  ║',
        '╚══════════════════════════════════════════════╝',
        '',
        'A terminal-style blog built with React + Vite.',
        '',
        '  Author:   episv',
        '  Created:  2026-05-20',
        '  Stack:    React 18 / TypeScript / Tailwind CSS',
        '  Features: Markdown, LaTeX, Code Highlight, Slides',
        '',
        'Type "help" to see available commands.',
      ].join('\n'),
    }
  },
}
