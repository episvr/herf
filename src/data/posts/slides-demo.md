# PDF Slides Demo

This post demonstrates embedded PDF slides. Each page of the PDF becomes a slide in a reveal.js player.

## How It Works

Reference a PDF file in your markdown and it auto-renders as an interactive slideshow:

```markdown
[slides](/pdfs/demo.pdf)
```

The PDF is loaded client-side via pdf.js, each page rendered at 2x resolution for crisp display, then presented in a reveal.js container with keyboard/touch navigation.

## Example

[slides](/pdfs/demo.pdf)

[slides2](/pdfs/tlak.pdf)

## Navigation

- **← →** or **↑ ↓** — navigate between slides
- **Escape** — overview mode
- **F** — fullscreen
- **Click** the fullscreen button in the toolbar
