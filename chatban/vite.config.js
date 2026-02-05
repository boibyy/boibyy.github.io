import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/chatban/', 
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared-assets'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})