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
})

export default config
