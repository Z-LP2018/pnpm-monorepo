# 快速开始

本指南将帮助你快速在项目中使用 `@gulu/ui` 组件库。

## 安装

### 在 pnpm workspace 中使用

如果你的项目已经在 pnpm workspace 中，可以直接通过 workspace 协议安装：

```bash
pnpm add @gulu/ui@workspace
```

### 从本地安装

如果组件库在本地开发，可以通过文件路径安装：

```bash
pnpm add @gulu/ui@file:../packages/ui
```

### 从 npm 安装（发布后）

```bash
pnpm add @gulu/ui
```

或使用其他包管理器：

```bash
npm install @gulu/ui
# 或
yarn add @gulu/ui
```

## 引入样式

在使用组件之前，需要先引入组件库的样式文件。

### 在 main.ts 中引入

```typescript
import '@gulu/ui/gulu-ui.css'
```

### 在 Vite 项目中引入

如果你使用的是 Vite，可以在 `main.ts` 或入口文件中引入：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import '@gulu/ui/gulu-ui.css'

createApp(App).mount('#app')
```

## 使用组件

### 按需引入

推荐按需引入组件，这样可以减小打包体积：

```vue
<script setup lang="ts">
import { GuLuButton } from '@gulu/ui'
</script>

<template>
  <div>
    <GuLuButton>默认按钮</GuLuButton>
  </div>
</template>
```

### 全局注册（不推荐）

如果你需要在多个组件中使用，也可以全局注册：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import * as GuluUI from '@gulu/ui'
import '@gulu/ui/gulu-ui.css'

const app = createApp(App)

// 注册所有组件
Object.keys(GuluUI).forEach(key => {
  if (key.startsWith('Gu')) {
    app.component(key, GuluUI[key])
  }
})

app.mount('#app')
```

## TypeScript 支持

组件库提供了完整的 TypeScript 类型定义，无需额外配置即可享受类型提示和检查。

```typescript
import { GuLuButton } from '@gulu/ui'

// TypeScript 会自动推断类型
const handleClick = () => {
  console.log('按钮被点击')
}
```

## 下一步

- 📖 查看 [组件文档](/components/) 了解各个组件的详细用法
- 🎨 了解组件的 API 和属性配置
- 💡 查看更多使用示例和最佳实践

## 常见问题

### Q: 样式没有生效？

A: 请确保已经引入了样式文件 `@gulu/ui/gulu-ui.css`。

### Q: TypeScript 类型错误？

A: 请确保你的项目已安装 Vue 3.5+ 版本，组件库依赖 Vue 3.5+ 的类型定义。

### Q: 如何自定义样式？

A: 组件库使用 Tailwind CSS，你可以通过覆盖 CSS 变量或使用 Tailwind 工具类来自定义样式。
