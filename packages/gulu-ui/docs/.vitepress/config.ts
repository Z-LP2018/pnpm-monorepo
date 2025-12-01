import { defineConfig, loadEnv } from 'vitepress'
//组件示例
import { componentPreview, containerPreview } from '@vitepress-demo-preview/plugin'
//读取env
const mode = process.env.NODE_ENV || 'development'
const env = loadEnv(mode, process.cwd())
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@gulu/ui',
  description: '自定义的UI组件库',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '指南', link: '/guide/', activeMatch: '^/guide/' },
      { text: '组件', link: '/components/', activeMatch: '^/components/' },
    ],

    sidebar: {
      '/components/': [
        { text: '组件说明', link: '/components/', items: [] },
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button/' },
            { text: 'Dialog 对话框', link: '/components/dialog/' },
            { text: 'Progress 进度条', link: '/components/progress/' },
            { text: 'Upload 上传', link: '/components/upload/' },
          ],
        },
      ],
      '/guide/': [
        { text: '指南说明', link: '/guide/', items: [] },
        {
          text: '基础',
          items: [
            { text: '快速开始', link: '/guide/quick-start/' },
            { text: '修改主题', link: '/guide/custom-theme/' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
  markdown: {
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    },
  },
  vite: {
    server: {
      port: +env.VITE_DOCS_PORT,
    },
  },
})
