import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://yunipakistan.com',
      dynamicRoutes: [
        '/',
        '/about',
        '/services',
        '/contact',
        '/careers',
        '/certificates',
      ],
      // Optional: exclude certain paths
      exclude: ['/admin', '/private'],
      // Optional: set change frequency and priority
      changefreq: 'weekly',
      priority: 0.8,
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
})