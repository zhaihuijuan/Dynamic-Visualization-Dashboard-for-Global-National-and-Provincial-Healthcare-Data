import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    open: false,
    fs: {
      allow: [__dirname, path.resolve(__dirname, '..')]
    }
  },
  preview: {
    host: true,
    port: 5174,
    strictPort: true
  }
})
