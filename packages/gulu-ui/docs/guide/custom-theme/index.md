# 自定义主题

`@gulu/ui` 提供了灵活的主题色配置功能，你可以轻松地修改组件库的主题色，使其与你的品牌风格保持一致。

## 快速开始

### 使用 setTheme 函数

最简单的方式是使用 `setTheme` 函数来设置主题色：

```typescript
import { setTheme } from '@gulu/ui'

// 设置主色调（RGB 格式：三个数字，用逗号分隔）
setTheme({ primary: '64, 158, 255' })
```

### 颜色格式

`setTheme` 函数只接受 **RGB 格式**（三个数字，用逗号分隔）：

```typescript
// RGB 格式（三个数字，用逗号分隔）
setTheme({ primary: '64, 158, 255' })
setTheme({ primary: '34, 197, 94' })
setTheme({ primary: '251, 146, 60' })

// 也可以不带空格
setTheme({ primary: '64,158,255' })
```

**注意**：每个数字的范围是 0-255，分别代表红、绿、蓝三个通道的值。

## 设置多个颜色

你可以同时设置多个主题色：

```typescript
import { setTheme } from '@gulu/ui'

setTheme({
  primary: '64, 158, 255', // 主色调
  secondary: '128, 128, 128', // 次要色调
  success: '34, 197, 94', // 成功色
  warning: '251, 146, 60', // 警告色
  danger: '239, 68, 68', // 危险色
  info: '14, 165, 233', // 信息色
})
```

## 在 Vue 应用中使用

### 在 main.ts 中设置

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { setTheme } from '@gulu/ui'
import '@gulu/ui/gulu-ui.css'

// 设置主题色
setTheme({
  primary: '64, 158, 255',
  success: '34, 197, 94',
  warning: '251, 146, 60',
  danger: '239, 68, 68',
})

const app = createApp(App)
app.mount('#app')
```

### 动态切换主题色

你也可以在运行时动态切换主题色：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { setTheme } from '@gulu/ui'
import { GuLuButton } from '@gulu/ui'

const themes = [
  { name: '蓝色', color: '64, 158, 255' },
  { name: '绿色', color: '34, 197, 94' },
  { name: '紫色', color: '139, 92, 246' },
  { name: '红色', color: '239, 68, 68' },
]

const currentTheme = ref(themes[0].color)

const changeTheme = (color: string) => {
  currentTheme.value = color
  setTheme({ primary: color })
}
</script>

<template>
  <div>
    <h2>选择主题色</h2>
    <div class="theme-buttons">
      <GuLuButton
        v-for="theme in themes"
        :key="theme.color"
        :variant="currentTheme === theme.color ? 'primary' : 'secondary'"
        @click="changeTheme(theme.color)"
      >
        {{ theme.name }}
      </GuLuButton>
    </div>

    <div style="margin-top: 20px">
      <GuLuButton variant="primary">主要按钮</GuLuButton>
      <GuLuButton variant="secondary">次要按钮</GuLuButton>
      <GuLuButton variant="ghost">幽灵按钮</GuLuButton>
    </div>
  </div>
</template>

<style scoped>
.theme-buttons {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}
</style>
```

## 获取当前主题色

你可以使用 `getTheme` 函数获取当前的主题色值：

```typescript
import { getTheme } from '@gulu/ui'

const primaryColor = getTheme('primary')
console.log(primaryColor) // 输出: "64, 158, 255" (RGB 格式)
```

## 重置主题色

如果需要重置为主题色为默认值，可以使用 `resetTheme` 函数：

```typescript
import { resetTheme } from '@gulu/ui'

// 重置所有主题色为默认值
resetTheme()
```

## 针对特定元素设置主题

默认情况下，`setTheme` 会在 `document.documentElement` 上设置主题色，影响整个应用。你也可以针对特定元素设置主题：

```typescript
import { setTheme } from '@gulu/ui'

// 为特定容器设置主题
const container = document.querySelector('.my-container')
if (container) {
  setTheme({ primary: '64, 158, 255' }, container as HTMLElement)
}
```

## 使用 CSS 变量直接设置

如果你更喜欢直接使用 CSS，也可以直接设置 CSS 变量：

```css
:root {
  --gulu-primary-rgb: 64, 158, 255;
  --gulu-primary: rgba(var(--gulu-primary-rgb), 0.8);
}
```

注意：CSS 变量使用 RGB 格式（三个数字，用逗号分隔）。组件库会自动生成对应的 `rgba()` 颜色变量，用于不同透明度的场景。

## 完整的主题色变量列表

组件库定义了以下主题色变量：

- `--gulu-primary`: 主色调
- `--gulu-secondary`: 次要色调
- `--gulu-success`: 成功色
- `--gulu-warning`: 警告色
- `--gulu-danger`: 危险色
- `--gulu-info`: 信息色

每个颜色都有对应的衍生变量：

- `--gulu-{color}-rgb`: RGB 值（三个数字，用逗号分隔，如 `64, 158, 255`, 默认为深色）
- `--gulu-{color}`: rgba 颜色值（如 `rgba(var(--gulu-primary-rgb), 0.8)`）
- `--gulu-{color}-light`: 浅色变体（10% 透明度）
- `--gulu-{color}-dark`: 深色变体（100% 不透明度）

## 最佳实践

1. **在应用启动时设置主题**：建议在 `main.ts` 或应用入口文件中设置主题色，确保所有组件都能正确应用主题。

2. **使用品牌色**：选择与你的品牌风格一致的颜色，保持视觉统一性。

3. **考虑可访问性**：确保主题色与背景色有足够的对比度，符合 WCAG 可访问性标准。

4. **测试不同场景**：在不同设备和浏览器上测试主题色，确保显示效果一致。

## 示例

查看 [快速开始](/guide/quick-start/) 了解更多使用示例。
