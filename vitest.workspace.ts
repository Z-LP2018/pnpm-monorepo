import { defineWorkspace } from 'vitest/config'

/**
 * Vitest 工作区配置
 * 用于在 monorepo 中配置多个测试项目
 */
export default defineWorkspace([
  // 可以在这里添加各个子项目的测试配置
  // 例如:
  // {
  //   test: {
  //     name: 'ui-components',
  //     root: './packages/ui-components',
  //     include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  //   },
  // },
])
