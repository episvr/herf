import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-math': ['katex', 'rehype-katex', 'remark-math'],
          'vendor-md': ['react-markdown', 'remark-gfm'],
          'vendor-pdf': ['pdfjs-dist', 'reveal.js'],
        },
      },
    },
  },
})
