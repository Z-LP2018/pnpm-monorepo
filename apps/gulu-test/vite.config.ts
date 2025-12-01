import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import { autoLayoutsPlugin } from './src/plugins/auto-layouts'
import { miniTailwindPlugin } from './src/plugins/miniTailwind'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      tailwindcss(),
      miniTailwindPlugin(),
      autoLayoutsPlugin(),
      vueJsx(),
      Components({
        dts: true,
        resolvers: [
          name => {
            if (name.startsWith('my')) {
              return `@/components/${name}/index.vue`
            }
          },
          ElementPlusResolver(),
        ],
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: +env.VITE_PORT as number,
      proxy: {
        '/api': {
          target: env.VITE_BASE_API_URL || 'http://localhost',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
