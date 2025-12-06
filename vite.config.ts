import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin to copy index.html to 404.html for GitHub Pages SPA routing
    {
      name: 'copy-404',
      closeBundle() {
        const distPath = join(__dirname, 'dist')
        copyFileSync(join(distPath, 'index.html'), join(distPath, '404.html'))
      }
    }
  ],
  // Base path for GitHub Pages deployment
  base: '/orthodox-website/',
})

