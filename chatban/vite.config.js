import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/chatban/', 
  root: './', 
  build: {
    outDir: '../chatban/',
    emptyOutDir: true,
  }
})