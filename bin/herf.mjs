#!/usr/bin/env node

import { Command } from 'commander'
import { initCommand } from '../lib/commands/init.js'
import { newCommand } from '../lib/commands/new.js'
import { devCommand } from '../lib/commands/dev.js'
import { buildCommand } from '../lib/commands/build.js'
import { generateCommand } from '../lib/commands/generate.js'

const program = new Command()

program
  .name('herf')
  .description('A terminal-style blog CLI tool')
  .version('0.0.1')

program
  .command('init <name>')
  .description('Initialize a new herf project')
  .action(initCommand)

program
  .command('new <title>')
  .description('Create a new blog post')
  .option('-c, --category <category>', 'Post category', 'tech')
  .option('-t, --tags <tags>', 'Comma-separated tags')
  .action(newCommand)

program
  .command('dev')
  .description('Start development server')
  .option('-p, --port <port>', 'Server port', '5173')
  .action(devCommand)

program
  .command('build')
  .description('Build for production')
  .action(buildCommand)

program
  .command('generate')
  .description('Generate posts.json index from markdown files')
  .option('-f, --force', 'Force regenerate all posts')
  .action((opts) => generateCommand({ force: opts.force }))

program.parse()
