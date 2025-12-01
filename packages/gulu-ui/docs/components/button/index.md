# Button 按钮

按钮用于触发一个操作，是用户界面中最常用的交互元素之一。

## 基本用法

`GuLuButton` 组件提供了三种样式。`primary`|`secondary`| `ghost`, 默认为`primary`：

:::preview 基本用法

demo-preview=./demos/index.vue

:::

## Loading 状态

当按钮需要执行异步操作时，可以使用 `loading` 属性来显示加载状态。在加载状态下，按钮会自动禁用，并显示旋转的加载动画。

### 异步操作示例

:::preview 异步操作示例

demo-preview=./demos/loading.vue

:::

## 自定义内容

使用默认插槽可以自定义按钮的内容：

:::preview 使用默认插槽可以自定义按钮的内容：

demo-preview=./demos/customContent.vue

:::

## API

### Props

| 属性名    | 说明             | 类型                                  | 默认值    | 必填 |
| --------- | ---------------- | ------------------------------------- | --------- | ---- |
| `variant` | 按钮的样式变体   | `'primary' \| 'secondary' \| 'ghost'` | `primary` | 否   |
| `loading` | 是否显示加载状态 | `boolean`                             | `false`   | 否   |

### Slots

| 插槽名    | 说明     |
| --------- | -------- |
| `default` | 按钮内容 |

## 样式定制

按钮的颜色可以通过主题色系统进行定制，详见 [自定义主题](/guide/custom-theme/)。

## 注意事项

1. **Loading 状态**：当 `loading` 为 `true` 时，按钮会自动禁用（`disabled` 属性），无法点击
2. **原生按钮**：组件使用原生 `<button>` 元素，支持所有标准的 HTML 按钮属性
3. **样式覆盖**：如果需要自定义样式，建议通过 CSS 变量或覆盖类名来实现，而不是直接修改组件样式

## 下一步

- 📖 查看 [快速开始](/guide/quick-start/) 了解如何安装和使用
- 🎨 了解 [自定义主题](/guide/custom-theme/) 来定制按钮颜色
- 🧩 查看其他组件的文档
