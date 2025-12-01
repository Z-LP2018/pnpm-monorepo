import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
//新手引导的css
import 'driver.js/dist/driver.css'
//ElementPlus的css
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
//自定义组件的css
import '@gulu/ui/gulu-ui.css'
//mini-tailwind
import 'virtual:mini-tailwind.css'
//nprogress的css
import 'nprogress/nprogress.css'
import { createApp } from 'vue'
import App from './App.vue'
//项目的css
import './style.css'
//主题切换
import { initTheme } from './hooks/useTheme'
//错误处理
import { exceptionInterceptor } from './hooks/useReactiveForm'
//路由&pinia
import { router } from './router'
import { pinia } from './store'
//Vconsole
// import Vconsole from "vconsole";
// new Vconsole();
// 在应用挂载前初始化主题
initTheme()
exceptionInterceptor()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(ElementPlus)
//注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
