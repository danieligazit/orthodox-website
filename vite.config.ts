import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path: Use '/' for local development
  // Change to '/orthodox-website/' when deploying to GitHub Pages
  base: '/',
})

