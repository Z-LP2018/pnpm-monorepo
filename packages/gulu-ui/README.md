# Gulu UI 组件库

基于 Vue 3 + TypeScript + Vite 构建的现代化 UI 组件库。

## 项目概述

本项目是从 Vite 创建的 Vue 3 项目改造而来的组件库项目，支持 ES Module 和 UMD 两种打包格式，提供完整的 TypeScript 类型声明，并集成了 VitePress 文档系统。

## 改造步骤

### 第一步：修改 Vite 配置为库模式

将 Vite 配置从应用模式改为库模式，支持组件库的打包输出。

**修改 `vite.config.ts`：**

```typescript
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      outDir: './dist/types',
      entryRoot: './src',
      tsconfigPath: './tsconfig.app.json',
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['playground/**/*', 'src/main.ts'],
      insertTypesEntry: true,
      copyDtsFiles: false,
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
  },
})
```

**关键改造点：**

- 使用 `build.lib` 配置库模式打包
- 配置入口文件为 `src/index.ts`
- 支持 ES 和 UMD 两种格式输出
- 将 Vue 设置为外部依赖（external）

### 第二步：配置 TypeScript 类型声明生成

分离 TypeScript 配置，支持类型声明文件的生成。

**创建 `tsconfig.json`（项目根配置）：**

```json
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }]
}
```

**修改 `tsconfig.app.json`（应用配置）：**

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "declaration": true,
    "declarationMap": true,
    "strict": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": ["src/main.ts", "playground/**/*"]
}
```

**关键改造点：**

- 使用项目引用（Project References）分离配置
- 启用 `declaration` 生成类型声明文件
- 排除 `playground` 和 `main.ts`（开发测试文件）

### 第三步：配置 package.json 导出字段

配置包的入口点和导出字段，支持不同模块系统的导入。

**修改 `package.json`：**

```json
{
  "name": "@gulu/ui",
  "version": "0.0.0",
  "type": "module",
  "main": "./dist/gulu-ui.umd.js",
  "module": "./dist/gulu-ui.js",
  "types": "./dist/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/gulu-ui.js",
      "require": "./dist/gulu-ui.umd.js"
    },
    "./gulu-ui.css": "./dist/gulu-ui.css"
  },
  "files": ["dist"],
  "peerDependencies": {
    "vue": "^3.5.0"
  }
}
```

**关键改造点：**

- 配置 `main`（UMD）、`module`（ES）、`types`（类型声明）
- 使用 `exports` 字段提供条件导出
- 将 Vue 设置为 `peerDependencies`
- 使用 `files` 字段指定发布内容

### 第四步：创建组件库入口文件

创建统一的组件导出入口。

**创建 `src/index.ts`：**

```typescript
import './index.css'

export * from './components/index'
export * from './utils/theme'
```

**创建 `src/components/index.ts`：**

```typescript
export { GuLuButton } from './button/index'
export { GuLuDialog } from './dialog/index'
export { GuLuProgress } from './progress/index'
export { GuLuUpload } from './upload/index'
```

**关键改造点：**

- 统一导出所有组件
- 导入样式文件
- 每个组件目录创建独立的 `index.ts` 导出文件

### 第五步：集成样式系统

集成 Tailwind CSS 并配置自定义主题变量。

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

**创建 `src/index.css`：**

```css
@import 'tailwindcss' layer(utilities) important;

@layer base {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

:root {
  --gulu-primary-rgb: 51, 133, 230;
  --gulu-primary: rgba(var(--gulu-primary-rgb), 0.9);
  /* 更多主题变量... */
}
```

**关键改造点：**

- 使用 Tailwind CSS Vite 插件
- 定义 CSS 变量实现主题系统
- 支持暗色/亮色主题切换

### 第六步：配置开发测试环境

创建 playground 目录用于组件开发和测试。

**创建 `playground/main.ts`：**

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')
```

**修改 `vite.config.ts` 排除 playground：**

```typescript
dts({
  exclude: ['playground/**/*', 'src/main.ts'],
})
```

**关键改造点：**

- 保留 `playground` 目录用于开发测试
- 类型声明生成时排除 playground
- 开发时使用 playground 测试组件

### 第七步：集成文档系统

使用 VitePress 构建组件文档。

**安装依赖：**

```bash
pnpm add -D vitepress @vitepress-demo-preview/component @vitepress-demo-preview/plugin
```

**配置 `package.json` 脚本：**

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

**关键改造点：**

- 使用 VitePress 构建文档站点
- 支持组件示例预览
- 文档与组件代码分离

### 第八步：配置构建脚本

优化构建流程，支持类型检查和清理。

**修改 `package.json` 脚本：**

```json
{
  "scripts": {
    "clean": "rimraf dist",
    "build": "pnpm clean && vue-tsc -b && vite build",
    "dev": "vite",
    "preview": "vite preview --host"
  }
}
```

**关键改造点：**

- 构建前清理旧文件
- 构建前进行类型检查
- 支持预览构建结果

## 项目结构

```text
packages/ui/
├── src/                    # 组件库源码
│   ├── components/         # 组件目录
│   │   ├── button/
│   │   ├── dialog/
│   │   ├── progress/
│   │   └── upload/
│   ├── utils/              # 工具函数
│   ├── index.ts            # 入口文件
│   └── index.css           # 样式文件
├── playground/             # 开发测试环境
├── docs/                   # VitePress 文档
├── dist/                   # 构建输出
│   ├── types/              # TypeScript 类型声明
│   ├── gulu-ui.js          # ES Module
│   ├── gulu-ui.umd.js      # UMD 格式
│   └── gulu-ui.css         # 样式文件
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 根配置
├── tsconfig.app.json       # 应用 TypeScript 配置
└── package.json            # 包配置
```

## 开发指南

### 开发组件

1. 在 `src/components/` 下创建组件目录
2. 创建组件 Vue 文件
3. 创建 `index.ts` 导出组件
4. 在 `src/components/index.ts` 中导出
5. 在 `playground` 中测试组件

### 构建组件库

```bash
# 清理构建产物
pnpm clean

# 构建组件库
pnpm build
```

### 开发文档

```bash
# 启动文档开发服务器
pnpm docs:dev

# 构建文档
pnpm docs:build
```

## 使用方式

### 安装

```bash
pnpm add @gulu/ui
```

### 引入使用

```typescript
// 按需引入
import { GuLuButton, GuLuDialog } from '@gulu/ui'
import '@gulu/ui/gulu-ui.css'

// 或全量引入
import * as GuluUI from '@gulu/ui'
import '@gulu/ui/gulu-ui.css'
```

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 下一代前端构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **VitePress** - 基于 Vite 的静态站点生成器

## 许可证

MIT
