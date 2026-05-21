import { Command } from './index'

export const dateCmd: Command = {
  name: 'date',
  description: 'Show current date and time',
  usage: 'date',
  execute: async () => {
    return { text: new Date().toLocaleString('zh-CN', { dateStyle: 'full', timeStyle: 'long' }) }
  },
}
