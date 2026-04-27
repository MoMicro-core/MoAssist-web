import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import VitePluginSitemap from 'vite-plugin-sitemap'
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    react(),
    VitePluginSitemap({
      hostname: 'https://moassist.com',
      routes: [
        '/',
        '/de',
        '/es',
        '/fr',
        '/it',
        '/ru',
        '/ua',
        '/pricing',
        '/contacts',
        '/momicro',
        '/login',
        '/chatbots',
      ],
    }),
    compression({ algorithm: 'brotliCompress', exclude: [/\.(png|webp|jpg|jpeg|gif|svg|woff2)$/] }),
    compression({ algorithm: 'gzip', exclude: [/\.(png|webp|jpg|jpeg|gif|svg|woff2)$/] }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth'],
          ui: ['@headlessui/react', '@heroicons/react'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
