# tty-blog

A terminal-style blog CLI tool. Write markdown, get a terminal-themed blog.

## Quick Start

```bash
npx tty-blog init my-blog
cd my-blog
npm run dev
```

## Commands

```bash
tty-blog init <name>     # Create a new blog project
tty-blog new <title>     # Create a new post
tty-blog dev             # Start dev server
tty-blog build           # Build for production
tty-blog generate        # Regenerate posts index
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
tty-blog new "My Post Title"
```

## Features

- Terminal-style UI with CRT effects
- Shell commands (ls, cat, grep, etc.)
- LaTeX math via KaTeX
- Code syntax highlighting
- Embedded PDF slides
- Floating window system

## License

MIT
