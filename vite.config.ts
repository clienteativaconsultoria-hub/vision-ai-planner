import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/cakto-proxy': {
        target: 'https://api.cakto.com.br',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/cakto-proxy/, ''),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
