//vitePress文档的样式
import DefaultTheme from 'vitepress/theme'
import './index.css'
//组件示例
import { ElementPlusContainer } from '@vitepress-demo-preview/component'
import '@vitepress-demo-preview/component/dist/style.css'
// 导入组件库
import '@gulu/ui/gulu-ui.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('demo-preview', ElementPlusContainer)
  },
}
