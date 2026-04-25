// vite.config.js
import { defineConfig } from "file:///sessions/affectionate-pensive-dijkstra/mnt/MoMicro/MoAssist-web/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/affectionate-pensive-dijkstra/mnt/MoMicro/MoAssist-web/node_modules/@vitejs/plugin-react/dist/index.js";
import VitePluginSitemap from "file:///sessions/affectionate-pensive-dijkstra/mnt/MoMicro/MoAssist-web/node_modules/vite-plugin-sitemap/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePluginSitemap({
      hostname: "https://moassist.com",
      routes: [
        "/",
        "/de",
        "/es",
        "/fr",
        "/it",
        "/ru",
        "/ua",
        "/pricing",
        "/contacts",
        "/momicro",
        "/login",
        "/chatbots"
      ]
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          firebase: ["firebase/app", "firebase/auth"],
          ui: ["@headlessui/react", "@heroicons/react", "framer-motion"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvYWZmZWN0aW9uYXRlLXBlbnNpdmUtZGlqa3N0cmEvbW50L01vTWljcm8vTW9Bc3Npc3Qtd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMvYWZmZWN0aW9uYXRlLXBlbnNpdmUtZGlqa3N0cmEvbW50L01vTWljcm8vTW9Bc3Npc3Qtd2ViL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9zZXNzaW9ucy9hZmZlY3Rpb25hdGUtcGVuc2l2ZS1kaWprc3RyYS9tbnQvTW9NaWNyby9Nb0Fzc2lzdC13ZWIvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IFZpdGVQbHVnaW5TaXRlbWFwIGZyb20gJ3ZpdGUtcGx1Z2luLXNpdGVtYXAnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIFZpdGVQbHVnaW5TaXRlbWFwKHtcbiAgICAgIGhvc3RuYW1lOiAnaHR0cHM6Ly9tb2Fzc2lzdC5jb20nLFxuICAgICAgcm91dGVzOiBbXG4gICAgICAgICcvJyxcbiAgICAgICAgJy9kZScsXG4gICAgICAgICcvZXMnLFxuICAgICAgICAnL2ZyJyxcbiAgICAgICAgJy9pdCcsXG4gICAgICAgICcvcnUnLFxuICAgICAgICAnL3VhJyxcbiAgICAgICAgJy9wcmljaW5nJyxcbiAgICAgICAgJy9jb250YWN0cycsXG4gICAgICAgICcvbW9taWNybycsXG4gICAgICAgICcvbG9naW4nLFxuICAgICAgICAnL2NoYXRib3RzJyxcbiAgICAgIF0sXG4gICAgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgIGZpcmViYXNlOiBbJ2ZpcmViYXNlL2FwcCcsICdmaXJlYmFzZS9hdXRoJ10sXG4gICAgICAgICAgdWk6IFsnQGhlYWRsZXNzdWkvcmVhY3QnLCAnQGhlcm9pY29ucy9yZWFjdCcsICdmcmFtZXItbW90aW9uJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrWCxTQUFTLG9CQUFvQjtBQUMvWSxPQUFPLFdBQVc7QUFDbEIsT0FBTyx1QkFBdUI7QUFFOUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sa0JBQWtCO0FBQUEsTUFDaEIsVUFBVTtBQUFBLE1BQ1YsUUFBUTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ2pELFVBQVUsQ0FBQyxnQkFBZ0IsZUFBZTtBQUFBLFVBQzFDLElBQUksQ0FBQyxxQkFBcUIsb0JBQW9CLGVBQWU7QUFBQSxRQUMvRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
