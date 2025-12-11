import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'static/js/chatbox.js',
        chunkFileNames: 'static/js/chatbox.chunk.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'static/css/chatbot.css'
          }
          return 'static/media/[name].[ext]'
        },
      },
    },
  },
})
