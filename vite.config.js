import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/appeal-form/', 
  root: './',
  build: {
    outDir: '../dist/appeal-form', // Build for mrege
  }
})