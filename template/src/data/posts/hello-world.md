---
title: Hello, Herf
date: 2026-05-21
category: intro
tags: [hello, guide, demo]
---

# Hello, Herf

Welcome to **herf**, a terminal-style blog for people who like their interfaces
fast, focused, and a little nostalgic.

This page is also a working example. Posts are plain Markdown files, but you
read them through a small shell in your browser.

## Start Here

Try these commands in the terminal:

```bash
help              # show available commands
ls                # list all posts
cat hello-world   # read this post again
grep herf         # search across posts
pwd               # show the current location
theme amber       # switch the terminal theme
```

The command prompt is not decoration. It is the main way to explore the blog.

## Write A Post

Create a new post from your project directory:

```bash
herf new "My First Post"
npm run dev
```

The new Markdown file lives in `src/data/posts/`. Edit it, save it, and the
development server will show the changes immediately.

Each post starts with frontmatter:

```markdown
---
title: My First Post
date: 2026-05-21
category: notes
tags: [web, ideas]
---

Write your story here.
```

## Markdown, Without Limits

Use the syntax you already know:

- **Bold**, *italic*, ~~strikethrough~~, and `inline code`
- Tables, task lists, blockquotes, and links
- Syntax-highlighted code blocks
- LaTeX math with `$...$` and `$$...$$`

For example, the quadratic formula is:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

And a small TypeScript example:

```typescript
const greeting = 'Hello, Herf'
console.log(greeting)
```

## Build And Share

When the post is ready, generate the index and build a static site:

```bash
herf generate
npm run build
```

The result is a fast static site that can be deployed to GitHub Pages or any
static hosting service.

## Why Herf?

1. **Markdown first**: your content stays portable and readable.
2. **Terminal native**: browse posts with familiar shell commands.
3. **Developer friendly**: code, math, tables, and embedded assets included.
4. **Easy to customize**: change the theme and config without a database.

The name comes from a typo: `href` often became `herf`. Instead of fixing the
typo, we made it the identity.

Now type `ls` and explore the rest of the blog.

*Built with React, Vite, and one persistent typo.*
