import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import VitePluginSitemap from 'vite-plugin-sitemap'
import { compression } from 'vite-plugin-compression2'

// Public marketing routes (locale-less) + every locale-prefixed mirror, so the
// sitemap advertises all indexable URLs across the 7 supported languages.
const PUBLIC_PATHS = [
  '/how-it-works',
  '/ai-chatbot',
  '/platform',
  '/pricing',
  '/news',
  '/docs',
  '/contact',
  '/privacy-policy',
  '/imprint',
  '/terms-and-conditions',
]
const LOCALES = ['de', 'es', 'fr', 'it', 'ru', 'ua']
const sitemapRoutes = [
  ...LOCALES.map((l) => `/${l}`),
  ...PUBLIC_PATHS,
  ...LOCALES.flatMap((l) => PUBLIC_PATHS.map((p) => `/${l}${p}`)),
]

export default defineConfig({
  plugins: [
    react(),
    VitePluginSitemap({
      hostname: 'https://momicro.com',
      dynamicRoutes: sitemapRoutes,
      exclude: ['/login', '/chatbots'],
      // Plugin-generated robots.txt overwrites public/robots.txt, so the
      // private-route Disallow rules must be declared here too.
      robots: [
        {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/chatbots',
            '/chats',
            '/billings',
            '/profile',
            '/settings',
            '/support',
            '/billing/',
            '/login',
          ],
        },
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
