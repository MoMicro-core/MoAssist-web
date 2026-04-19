import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import VitePluginSitemap from 'vite-plugin-sitemap'

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
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth'],
          ui: ['@headlessui/react', '@heroicons/react', 'framer-motion'],
        },
      },
    },
  },
})
