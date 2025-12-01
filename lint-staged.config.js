/**
 * lint-staged 配置
 * 用于在 Git 提交前对暂存的文件进行检查和格式化
 */
export default {
  // 对所有暂存的 TypeScript/JavaScript 文件进行格式化和检查
  '*.{js,jsx,ts,tsx,mjs,cjs}': ['prettier --write', 'oxlint --fix'],

  // 对 JSON、Markdown、CSS 等文件进行格式化
  '*.{json,md,mdx,css,scss,less,html,yml,yaml}': ['prettier --write'],

  // 对 Vue 文件进行格式化
  '*.vue': ['prettier --write'],
}
