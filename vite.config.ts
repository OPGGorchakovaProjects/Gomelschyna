import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'), 
      '@components': path.resolve(__dirname, 'src/components'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@theme': path.resolve(__dirname, 'src/theme'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@features': path.resolve(__dirname, 'src/features'),
    }
  },
  // server: {
  //   headers: {
  //     'X-Content-Type-Options': 'nosniff',
  //   }
  // },
  // assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  // optimizeDeps: {
  //   include: ['react', 'react-dom'],
  // },
  // esbuild: {
  //   loader: 'tsx',
  // },
  // build: {
  //   outDir: 'dist',
  //   emptyOutDir: true,
  // },
  // base: '/',
})
