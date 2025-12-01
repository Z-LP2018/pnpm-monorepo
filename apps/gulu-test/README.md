# My Test 应用

基于 Vue 3 + TypeScript + Vite 构建的现代化前端应用项目。

## 项目概述

本项目是从 Vite 创建的 Vue 3 项目改造而来的企业级应用项目，集成了 Element Plus UI 框架、Pinia 状态管理、Vue Router 路由、Tailwind CSS 样式系统，并实现了自动导入、自定义插件等高级功能。

## 改造步骤

### 第一步：集成 Element Plus UI 框架

集成 Element Plus 作为项目的 UI 组件库。

**安装依赖：**

```bash
pnpm add element-plus @element-plus/icons-vue
```

**在 `src/main.ts` 中引入：**

```typescript
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

**关键改造点：**

- 全局注册 Element Plus 组件
- 引入 Element Plus 样式和暗色主题
- 注册所有 Element Plus 图标组件

### 第二步：集成 Tailwind CSS

集成 Tailwind CSS 作为项目的样式框架。

**安装依赖：**

```bash
pnpm add -D @tailwindcss/vite tailwindcss
```

**修改 `vite.config.ts`：**

```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // ...
  ],
})
```

**创建 `src/style.css`：**

```css
@import 'tailwindcss';
```

**关键改造点：**

- 使用 Tailwind CSS Vite 插件
- 在入口文件中引入样式

### 第三步：配置自动导入插件

使用 `unplugin-auto-import` 和 `unplugin-vue-components` 实现自动导入。

**安装依赖：**

```bash
pnpm add -D unplugin-auto-import unplugin-vue-components
```

**修改 `vite.config.ts`：**

```typescript
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    Components({
      dts: true,
      resolvers: [
        name => {
          // 自定义组件解析器：my 开头的组件自动从 @/components 导入
          if (name.startsWith('my')) {
            return `@/components/${name}/index.vue`
          }
        },
        ElementPlusResolver(), // Element Plus 自动导入
      ],
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

**关键改造点：**

- 自动导入 Element Plus 组件和 API
- 自定义组件自动导入规则（my 开头）
- 生成类型声明文件（`components.d.ts`、`auto-imports.d.ts`）

### 第四步：集成 Pinia 状态管理

使用 Pinia 替代 Vuex 作为状态管理方案，并配置持久化插件。

**安装依赖：**

```bash
pnpm add pinia pinia-plugin-persistedstate
```

**创建 `src/store/index.ts`：**

```typescript
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(createPersistedState())

export { pinia }
```

**在 `src/main.ts` 中使用：**

```typescript
import { pinia } from './store'

const app = createApp(App)
app.use(pinia)
```

**关键改造点：**

- 使用 Pinia 作为状态管理
- 集成持久化插件，支持状态持久化
- 创建模块化的 store 结构

### 第五步：集成 Vue Router

配置 Vue Router 并实现路由守卫、历史记录等功能。

**安装依赖：**

```bash
pnpm add vue-router
```

**创建 `src/router/index.ts`：**

```typescript
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 登录验证逻辑
  // 路由历史记录
  next()
})

export { router }
```

**在 `src/main.ts` 中使用：**

```typescript
import { router } from './router'

const app = createApp(App)
app.use(router)
```

**关键改造点：**

- 使用 Hash 路由模式
- 实现路由守卫（登录验证、权限控制）
- 集成路由历史记录功能
- 使用 NProgress 显示路由加载进度

### 第六步：配置路径别名

配置 `@` 别名指向 `src` 目录，简化导入路径。

**修改 `vite.config.ts`：**

```typescript
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**修改 `tsconfig.app.json`：**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**关键改造点：**

- 配置 Vite 路径别名
- 配置 TypeScript 路径映射
- 统一使用 `@/` 前缀导入

### 第七步：支持 JSX/TSX

配置 Vue JSX 支持，可以使用 JSX 语法编写组件。

**安装依赖：**

```bash
pnpm add -D @vitejs/plugin-vue-jsx
```

**修改 `vite.config.ts`：**

```typescript
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // ...
  ],
})
```

**关键改造点：**

- 支持 JSX/TSX 语法
- 可以在 `.tsx` 文件中使用 JSX

### 第八步：配置 TypeScript 装饰器支持

启用 TypeScript 装饰器支持，用于依赖注入、验证等功能。

**修改 `tsconfig.app.json`：**

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

**安装装饰器相关依赖：**

```bash
pnpm add reflect-metadata class-validator
```

**关键改造点：**

- 启用装饰器语法支持
- 支持元数据反射
- 可用于类验证、依赖注入等场景

### 第九步：创建自定义 Vite 插件

创建自动布局插件和 Mini Tailwind 插件。

#### 9.1 自动布局插件（auto-layouts）

**创建 `src/plugins/auto-layouts/index.ts`：**

```typescript
import type { Plugin } from 'vite'

export function autoLayoutsPlugin(): Plugin {
  return {
    name: 'auto-layouts',
    // 扫描 src/layouts 目录，自动生成布局映射
    // 类似 Next.js 的约定式布局系统
  }
}
```

**在 `vite.config.ts` 中使用：**

```typescript
import { autoLayoutsPlugin } from './src/plugins/auto-layouts'

export default defineConfig({
  plugins: [
    autoLayoutsPlugin(),
    // ...
  ],
})
```

**创建类型声明 `global.d.ts`：**

```typescript
declare module 'virtual:auto-layouts' {
  import type { Component } from 'vue'
  export const layoutComponents: Record<string, Component>
  export const layoutNames: string[]
}
```

#### 9.2 Mini Tailwind 插件

**创建 `src/plugins/miniTailwind/index.ts`：**

```typescript
import type { Plugin } from 'vite'

export function miniTailwindPlugin(): Plugin {
  return {
    name: 'mini-tailwind',
    // 扫描代码中使用的 Tailwind 类名
    // 只生成实际使用的 CSS，减小打包体积
  }
}
```

**在 `src/main.ts` 中引入：**

```typescript
import 'virtual:mini-tailwind.css'
```

**关键改造点：**

- 实现约定式布局系统
- 实现按需生成 Tailwind CSS
- 使用虚拟模块提供类型支持

### 第十步：配置开发服务器代理

配置开发服务器的 API 代理，解决跨域问题。

**修改 `vite.config.ts`：**

```typescript
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    server: {
      port: +env.VITE_PORT,
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
```

**创建 `.env` 文件：**

```env
VITE_PORT=5173
VITE_BASE_API_URL=http://localhost:3000
```

**关键改造点：**

- 配置 API 代理路径
- 使用环境变量配置端口和 API 地址
- 支持路径重写

### 第十一步：集成自定义 UI 组件库

集成工作区内的自定义 UI 组件库。

**在 `package.json` 中添加依赖：**

```json
{
  "devDependencies": {
    "@gulu/ui": "workspace:*"
  }
}
```

**在 `src/main.ts` 中引入样式：**

```typescript
import '@gulu/ui/gulu-ui.css'
```

**关键改造点：**

- 使用 pnpm workspace 引用本地包
- 引入自定义组件库样式

### 第十二步：集成常用工具库

集成项目开发中常用的工具库。

**安装依赖：**

```bash
# HTTP 请求
pnpm add axios

# 工具函数
pnpm add @vueuse/core

# 图表库
pnpm add echarts echarts-liquidfill

# 3D 库
pnpm add three

# 动画库
pnpm add gsap

# WebSocket
pnpm add socket.io-client

# 进度条
pnpm add nprogress

# 引导提示
pnpm add driver.js

# 大屏适配
pnpm add v-scale-screen
```

**在 `src/main.ts` 中引入样式：**

```typescript
import 'nprogress/nprogress.css'
```

**关键改造点：**

- 按需集成功能库
- 统一管理依赖版本
- 在入口文件中引入必要的样式

### 第十三步：创建自定义 Hooks

创建可复用的组合式函数。

**创建 `src/hooks/` 目录：**

- `useRequest.ts` - 请求封装
- `useTheme.ts` - 主题切换
- `useReactiveForm.ts` - 响应式表单
- `useRequire.ts` - 动态导入

**在 `src/main.ts` 中初始化：**

```typescript
import { initTheme } from './hooks/useTheme'
import { exceptionInterceptor } from './hooks/useReactiveForm'

initTheme()
exceptionInterceptor()
```

**关键改造点：**

- 封装常用业务逻辑
- 提供统一的错误处理
- 实现主题切换功能

### 第十四步：配置构建和预览

优化构建脚本，支持类型检查和预览。

**修改 `package.json` 脚本：**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "lint": "oxlint . && prettier --check \"**/*.{ts,tsx,js,jsx,json,md,vue,css,scss}\""
  }
}
```

**关键改造点：**

- 构建前进行类型检查
- 支持预览构建结果
- 配置代码检查工具

## 项目结构

```text
apps/my-test/
├── src/                      # 源代码目录
│   ├── assets/               # 静态资源
│   ├── components/           # 组件目录
│   │   └── myLayoutRouterView/
│   ├── hooks/                # 组合式函数
│   │   ├── useRequest.ts
│   │   ├── useTheme.ts
│   │   ├── useReactiveForm.ts
│   │   └── useRequire.ts
│   ├── layouts/              # 布局组件
│   │   └── routeHistory/
│   ├── pages/                # 页面组件
│   │   ├── getStart/
│   │   └── home/
│   ├── plugins/              # 自定义插件
│   │   ├── auto-layouts/
│   │   └── miniTailwind/
│   ├── router/               # 路由配置
│   │   ├── index.ts
│   │   └── routes/
│   ├── store/                # 状态管理
│   │   ├── index.ts
│   │   └── modules/
│   ├── App.vue               # 根组件
│   ├── main.ts               # 入口文件
│   └── style.css             # 全局样式
├── public/                   # 公共资源
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 根配置
├── tsconfig.app.json         # 应用 TypeScript 配置
├── global.d.ts               # 全局类型声明
├── components.d.ts           # 组件类型声明（自动生成）
├── auto-imports.d.ts         # 自动导入类型声明（自动生成）
└── package.json              # 项目配置
```

## 开发指南

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

### 代码检查

```bash
pnpm lint
```

## 功能特性

- ✅ **Element Plus UI 框架** - 丰富的组件库
- ✅ **Tailwind CSS** - 实用优先的 CSS 框架
- ✅ **自动导入** - 组件和 API 自动导入
- ✅ **Pinia 状态管理** - 现代化状态管理方案
- ✅ **Vue Router** - 路由管理和守卫
- ✅ **TypeScript** - 类型安全
- ✅ **JSX/TSX 支持** - 灵活的组件编写方式
- ✅ **装饰器支持** - 支持装饰器语法
- ✅ **自定义插件** - 自动布局、Mini Tailwind
- ✅ **主题切换** - 支持亮色/暗色主题
- ✅ **路由历史记录** - 自动记录路由历史
- ✅ **API 代理** - 开发环境代理配置

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 下一代前端构建工具
- **Element Plus** - 基于 Vue 3 的组件库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Pinia** - Vue 的状态管理库
- **Vue Router** - Vue.js 官方路由管理器
- **Axios** - HTTP 客户端
- **ECharts** - 数据可视化图表库
- **Three.js** - 3D 图形库

## 许可证

MIT
