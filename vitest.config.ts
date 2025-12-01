import { defineConfig } from 'vitest/config'

/**
 * Vitest 根配置
 * 子项目可以继承或扩展此配置
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
    },
  },
})
