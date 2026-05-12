import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://bikawebsite-nzces05x9-aldi12221s-projects.vercel.app',
        changeOrigin: true,
      }
    }
  }
})
