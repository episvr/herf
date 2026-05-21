# herf

A terminal-style blog CLI tool. Write markdown, get a terminal-themed blog.

> **Name origin:** I always typed `href` as `herf`, so I made it a feature.

## Quick Start

```bash
npx herf init my-blog
cd my-blog
npm run dev
```

## Commands

```bash
herf init <name>     # Create a new blog project
herf new <title>     # Create a new post
herf dev             # Start dev server
herf build           # Build for production
herf generate        # Regenerate posts index
```

## Writing Posts

Create a markdown file in `src/data/posts/` with frontmatter:

```markdown
---
title: My Post
date: 2026-05-21
category: tech
tags: [javascript, react]
---

# My Post

Content here...
```

Or use the CLI:

```bash
herf new "My Post Title"
```

## Features

- Terminal-style UI with CRT effects
- Shell commands (ls, cat, grep, etc.)
- LaTeX math via KaTeX
- Code syntax highlighting
- Embedded PDF slides
- Floating window system
- Table of Contents
- Configurable via blog.config.ts

## License

MIT
