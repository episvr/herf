#!/usr/bin/env node

import { readFileSync } from 'fs'
import { Command } from 'commander'
import { initCommand } from '../lib/commands/init.js'
import { newCommand } from '../lib/commands/new.js'
import { devCommand } from '../lib/commands/dev.js'
import { buildCommand } from '../lib/commands/build.js'
import { generateCommand } from '../lib/commands/generate.js'
import { cleanCommand } from '../lib/commands/clean.js'
import { log } from '../lib/utils/logger.mjs'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'))

function wrap(fn) {
  return async (...args) => {
    try {
      await fn(...args)
    } catch (error) {
      log.error(error.message)
      process.exit(1)
    }
  }
}

const program = new Command()

program
  .name('herf')
  .description('A terminal-style blog CLI tool')
  .version(pkg.version)

program
  .command('init [name]')
  .alias('i')
  .description('Initialize a new herf project (current directory if no name given)')
  .option('-s, --skip-install', 'Skip installing dependencies')
  .action(wrap((name, opts) => initCommand(name, { skipInstall: opts.skipInstall })))

program
  .command('new <title>')
  .alias('n')
  .description('Create a new blog post')
  .option('-c, --category <category>', 'Post category', 'tech')
  .option('-t, --tags <tags>', 'Comma-separated tags')
  .action(wrap(newCommand))

program
  .command('dev')
  .aliases(['s', 'server'])
  .description('Start development server (aliases: s, server)')
  .option('-p, --port <port>', 'Server port', '5173')
  .action(wrap(devCommand))

program
  .command('build')
  .description('Build for production')
  .action(wrap(buildCommand))

program
  .command('generate')
  .alias('g')
  .description('Generate posts.json index from markdown files')
  .option('-f, --force', 'Force regenerate all posts')
  .action(wrap((opts) => generateCommand({ force: opts.force })))

program
  .command('clean')
  .alias('c')
  .description('Clean build artifacts and cache')
  .action(wrap(cleanCommand))

program.parse()
