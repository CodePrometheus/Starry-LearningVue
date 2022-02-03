import { createVuePlugin } from 'vite-plugin-vue2'
import path from 'path'
import { defineConfig } from 'vite'

const config = defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [createVuePlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://www.codeman.ink:3000',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/m7': {
        target: 'http://m7.music.126.net',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/m7/, '')
      },
      'm701': {
        target: 'http://m701.music.126.net',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/m701/, '')
      },
      '/m8': {
        target: 'http://m8.music.126.net',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/m8/, '')
      },
      'm801': {
        target: 'http://m801.music.126.net',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/m801/, '')
      },
    },
  },
})

export default config
