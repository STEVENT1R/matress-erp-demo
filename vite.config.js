import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const basePath = '/matress-erp-demo/'

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['**/*'],
      manifest: {
        name: 'مراتب - نظام إدارة متاجر المراتب',
        short_name: 'مراتب',
        description: 'نظام ERP متكامل لإدارة متاجر المراتب',
        start_url: basePath,
        scope: basePath,
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#4f46e5',
        orientation: 'any',
        dir: 'rtl',
        lang: 'ar',
        icons: [
          {
            src: `${basePath}icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: `${basePath}icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    host: true
  }
})
