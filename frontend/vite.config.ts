import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // ← allows access from your local network
    port: 5173, // ← or any other port you prefer
    proxy: {
      '/api': {
        target: 'http://145.223.69.97:8000/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
})
