import react from '@vitejs/plugin-react-swc'
import {defineConfig, splitVendorChunkPlugin} from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
        entryFileNames: 'main.js',
        format: 'es',
        manualChunks: (id: string) => {
          if (id.includes('antd-')) {
            return 'antd-misc'
          }

          if (id.includes('antd')) {
            return 'antd'
          }
        }
      },
      preserveEntrySignatures: 'strict'
    }
  },
  plugins: [
    react(),
    svgr(),
    {
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
          next()
        })
      },
      name: 'vite-plugin-corp-headers'
    },
    splitVendorChunkPlugin()
  ]
})
