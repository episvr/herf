// Generate a simple multi-page PDF for demo purposes
import { writeFileSync } from 'fs'

function createPdf(pages) {
  let objects = []
  let offsets = []
  let objNum = 0

  function newObj(content) {
    objNum++
    objects.push(`${objNum} 0 obj\n${content}\nendobj`)
    return objNum
  }

  // Catalog
  const catalog = newObj('<< /Type /Catalog /Pages 2 0 R >>')
  // Pages (placeholder, will fill kids later)
  const pagesObj = 2; objNum++
  const pageRefs = []

  for (const page of pages) {
    const stream = `BT\n${page.map(l => `/F1 ${l.size} Tf\n${l.x} ${l.y} Td\n(${l.text}) Tj`).join('\n')}\nET`
    const content = newObj(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
    const pageObj = newObj(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${content} 0 R /Resources << /Font << /F1 ${objNum + 2} 0 R >> >> >>`)
    pageRefs.push(`${pageObj} 0 R`)
  }

  // Pages object
  objects.splice(1, 0, `${pagesObj} 0 obj\n<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${pages.length} >>\nendobj`)
  // Fix numbering: shift all objects after insert
  // Easier: rebuild
  return buildPdf(pages)
}

function buildPdf(pages) {
  const lines = ['%PDF-1.4']
  const objs = []

  function add(content) {
    objs.push(content)
    return objs.length // 1-based
  }

  add('<< /Type /Catalog /Pages 2 0 R >>') // 1
  const pageRefs = []
  for (const page of pages) {
    const stream = `BT\n${page.map(l => `/F1 ${l.size} Tf\n${l.x} ${l.y} Td\n(${l.text}) Tj`).join('\n')}\nET`
    const cNum = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
    const fontNum = objs.length + 2 + pages.length // will be after all pages + pages obj
    const pNum = add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${cNum} 0 R /Resources << /Font << /F1 ${fontNum} 0 R >> >> >>`)
    pageRefs.push(`${pNum} 0 R`)
  }
  // Insert pages obj at position 2
  objs.splice(1, 0, `<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${pages.length} >>`)
  // Re-number: the pages obj is now index 1 (obj 2), pages start at index 2
  // Actually this gets messy. Let me just do it sequentially.

  return buildPdfSimple(pages)
}

function buildPdfSimple(pages) {
  let buf = '%PDF-1.4\n'
  const offsets = []

  function write(content) {
    offsets.push(buf.length)
    buf += content + '\n'
  }

  // 1: Catalog
  write('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj')

  // 2: Pages
  const kids = pages.map((_, i) => `${3 + i * 2} 0 R`).join(' ')
  write(`2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>\nendobj`)

  // Font ref (after all pages)
  const fontObjNum = 3 + pages.length * 2

  // Pages
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    const stream = ['BT']
    for (const line of page) {
      stream.push(`/F1 ${line.size} Tf`)
      stream.push(`${line.x} ${line.y} Td`)
      stream.push(`(${line.text}) Tj`)
    }
    stream.push('ET')
    const streamStr = stream.join('\n')
    const contentNum = 3 + pages.length + i
    // Content obj
    write(`${contentNum} 0 obj\n<< /Length ${streamStr.length} >>\nstream\n${streamStr}\nendstream`)
    // Page obj
    write(`${3 + i * 2} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentNum} 0 R /Resources << /Font << /F1 ${fontObjNum} 0 R >> >> >>`)
  }

  // Font
  write(`${fontObjNum} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`)

  // Xref
  const xrefOffset = buf.length
  buf += 'xref\n'
  buf += `0 ${fontObjNum + 1}\n`
  buf += '0000000000 65535 f \n'
  for (const off of offsets) {
    buf += String(off).padStart(10, '0') + ' 00000 n \n'
  }
  buf += `trailer\n<< /Size ${fontObjNum + 1} /Root 1 0 R >>\n`
  buf += `startxref\n${xrefOffset}\n%%EOF`

  return buf
}

const pdf = buildPdfSimple([
  // Page 1
  [
    { text: 'Shell Blog Slides', size: 36, x: 80, y: 700 },
    { text: 'Embedded PDF Demo', size: 24, x: 130, y: 620 },
    { text: 'Each page = one slide', size: 18, x: 170, y: 560 },
    { text: 'Press arrow keys to navigate', size: 16, x: 155, y: 510 },
  ],
  // Page 2
  [
    { text: 'Architecture', size: 36, x: 160, y: 700 },
    { text: 'React + Vite + TypeScript', size: 18, x: 120, y: 620 },
    { text: 'pdf.js extracts page images', size: 18, x: 120, y: 580 },
    { text: 'reveal.js renders slideshow', size: 18, x: 120, y: 540 },
    { text: 'KaTeX + Prism for content', size: 18, x: 120, y: 500 },
  ],
  // Page 3
  [
    { text: 'Thank You!', size: 42, x: 150, y: 420 },
    { text: 'Type help to explore', size: 18, x: 175, y: 350 },
  ],
])

writeFileSync('D:/blog/code/public/pdfs/demo.pdf', pdf)
console.log('PDF generated: public/pdfs/demo.pdf')
