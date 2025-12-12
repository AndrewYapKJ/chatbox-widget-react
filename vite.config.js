import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://bx22azxigm5zpxxovu7gwq4n6q0uzrup.lambda-url.ap-southeast-1.on.aws',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
        secure: true,
      },
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'static/js/chatbot.js',
        chunkFileNames: 'static/js/chatbot.chunk.js',
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
