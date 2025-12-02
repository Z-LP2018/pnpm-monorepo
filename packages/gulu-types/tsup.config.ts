import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  // 不打包 class-validator 和 class-transformer
  external: ['class-validator', 'class-transformer', 'reflect-metadata'],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    }
  },
  // esbuild 默认会移除装饰器，需要保留
  target: 'es2020',
  // ✅ 保留类名（用于调试）
  keepNames: true,
  // ✅ 不压缩（保持可读性）
  minify: false,
})
