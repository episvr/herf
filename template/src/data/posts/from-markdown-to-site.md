---
title: From Markdown To A Published Site
date: 2026-05-23
category: workflow
tags: [markdown, vite, deployment]
---

# From Markdown To A Published Site

Herf keeps the publishing workflow deliberately small. There is no database,
admin panel, or special editor to learn. A post is a Markdown file, and the
site is built from the files in your repository.

## 1. Create The Project

Start with the CLI:

```bash
npx herf init my-blog
cd my-blog
npm install
```

The generated project includes the React template, a sample post, the Vite
configuration, and the commands needed to work locally.

## 2. Write In Plain Text

Create a post with a title:

```bash
herf new "A Note About Static Sites"
```

The command creates a file like
`src/data/posts/a-note-about-static-sites.md`. Frontmatter describes the post;
the rest is ordinary Markdown that can be edited in any text editor.

This is useful beyond convenience. Plain files are easy to search, review,
move between projects, and keep forever. Your content does not depend on a
hosted editor or a proprietary export format.

## 3. Preview The Result

Start the development server:

```bash
npm run dev
```

The browser shows the terminal interface, while Vite provides fast reloads as
you edit. When a post is added or renamed, Herf regenerates the post index so
the shell can find it.

## 4. Generate And Build

The production command performs a full rebuild:

```bash
herf build
```

That command regenerates `src/data/posts.json`, checks the TypeScript project,
and asks Vite to create the final files in `dist/`. The generated index is
derived data; the Markdown files remain the source of truth.

You can also run the steps separately when debugging:

```bash
herf generate
npm run build
```

## 5. Deploy Anywhere

The output in `dist/` is static HTML, JavaScript, CSS, fonts, and assets. It
can be served by GitHub Pages, Nginx, object storage, or any CDN that serves
static files.

For GitHub Pages, a typical workflow is:

```yaml
- run: npm ci
  working-directory: template
- run: npm run build
  working-directory: template
- uses: actions/upload-pages-artifact@v3
  with:
    path: template/dist
```

The important detail is to keep the deployment path aligned with Vite's
`base` setting. If the site lives at `/herf/`, generated assets must also use
`/herf/assets/...`.

## The Whole Loop

```text
Markdown -> generate -> TypeScript -> Vite -> dist -> static hosting
```

There are very few moving parts, which makes failures easier to diagnose and
the result easy to move. Write locally, review in Git, build when ready, and
publish the files.
