import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      tailwindcss(),
      dts({
        // 类型声明文件输出目录（相对于项目根目录）
        outDir: './dist/types',
        // 指定入口根目录，所有生成的类型文件路径将相对于此目录
        entryRoot: './src',
        // 编译器选项
        tsconfigPath: './tsconfig.app.json',
        // 包含的文件
        include: ['src/**/*.ts', 'src/**/*.vue'],
        // 排除的文件
        exclude: ['playground/**/*', 'src/main.ts', '**/*.spec.ts', '**/*.test.ts'],
        // 插入类型入口到 package.json
        insertTypesEntry: true,
        // 复制 .d.ts 文件
        copyDtsFiles: false,
        // 清理 Vue 文件名（移除 .vue 后缀）
        cleanVueFileName: true,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'GuluUI',
        fileName: 'gulu-ui',
        formats: ['es', 'umd'],
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
      // sourcemap: true,
    },
    server: {
      port: +env.VITE_PORT,
    },
  }
})
