import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: true,
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  },
  envPrefix: ['VITE_'],
  define: {
    'process.env': process.env
  },
  optimizeDeps: {
    exclude: ['@prisma/client']
  }
})