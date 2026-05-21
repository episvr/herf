---
title: Welcome to tty-blog
date: 2026-05-21
category: intro
tags: [demo, tutorial, features]
---

# Welcome to tty-blog

A terminal-style blog in your browser. Every post is a "file" you interact with using shell commands.

## Quick Start

```bash
help            # show all commands
ls              # list posts
cat hello       # read this post
grep math       # search content
wc hello        # word count
```

---

## Markdown Features

### Text Formatting

**Bold text**, *italic text*, ~~strikethrough~~, `inline code`.

> "The best interface is the one you already know."
> — Every terminal user ever

### Task Lists

- [x] Terminal UI with CRT effects
- [x] Shell commands (ls, cat, grep, wc, sort)
- [x] Markdown rendering
- [x] LaTeX math support
- [ ] World domination

---

## Code Highlighting

TypeScript with line numbers:

```typescript
interface Post {
  id: string
  title: string
  date: string
  tags: string[]
}

async function getPost(id: string): Promise<Post | null> {
  const response = await fetch(`/api/posts/${id}`)
  if (!response.ok) return null
  return response.json()
}
```

Python:

```python
def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence."""
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib[:n]

print(fibonacci(10))  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

Rust:

```rust
fn main() {
    let numbers: Vec<i32> = (1..=10).collect();
    let sum: i32 = numbers.iter().sum();
    println!("Sum of 1 to 10: {}", sum);
}
```

---

## LaTeX Math

Inline math: The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.

Euler's identity: $e^{i\pi} + 1 = 0$.

Block math:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

Matrix:

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$

---

## Tables

| Command | Description | Example |
|---------|-------------|---------|
| `ls` | List posts | `ls` or `ls -la` |
| `cat` | Read post | `cat hello` or `cat 1` |
| `grep` | Search | `grep math` |
| `wc` | Word count | `wc hello` |
| `sort` | Sort posts | `sort date` |
| `help` | Show help | `help` |

---

## Embedded Content

### PDF Slides

Embed PDF files as interactive slideshows:

[slides](/pdfs/demo.pdf)

### File Cards

Link to downloadable files:

[asset:/pdfs/demo.pdf](Download Demo PDF)

### GitHub Links

Embed GitHub repository cards:

[github:https://github.com/anthropics/claude-code](Claude Code)

---

## Why tty-blog?

1. **Terminal Native** — If you can use a terminal, you can use this blog
2. **Markdown First** — Write content in plain text, get beautiful output
3. **Developer Friendly** — Code highlighting, math formulas, tables
4. **Fast** — Built on Vite, instant hot reload
5. **Hackable** — Open source, easy to customize

---

## Get Started

```bash
# Create your first post
tty-blog new "My First Post"

# Start the dev server
npm run dev

# Build for production
npm run build
```

---

*Built with React, Vite, and love for the terminal.*
