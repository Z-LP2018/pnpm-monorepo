# Dialog 对话框

对话框用于在保留当前页面状态的情况下，告知用户并承载相关操作。它提供了丰富的配置选项和插槽，可以满足各种使用场景。

## 基本用法

`GuLuDialog` 组件通过 `v-model` 控制显示和隐藏。最简单的用法是传入 `title` 属性：

:::preview 基本用法

demo-preview=./demos/index.vue

:::

## 自定义宽度和标题

可以通过 `width` 属性自定义对话框的宽度，支持百分比或固定像素值：

:::preview 自定义宽度和标题

demo-preview=./demos/custom.vue

:::

## 使用插槽

`GuLuDialog` 提供了三个插槽：`header`、`default` 和 `footer`，可以完全自定义对话框的内容：

:::preview 使用插槽

demo-preview=./demos/slots.vue

:::

## 关闭前确认

通过 `beforeClose` 属性可以在关闭对话框前执行自定义逻辑，比如确认操作：

:::preview 关闭前确认

demo-preview=./demos/beforeClose.vue

:::

## 关闭选项

可以通过 `closeOnClickModal` 和 `closeOnPressEscape` 属性控制是否允许通过点击遮罩或按 ESC 键关闭对话框：

:::preview 关闭选项

demo-preview=./demos/closeOptions.vue

:::

## API

### Props

| 属性名               | 说明                               | 类型                         | 默认值  | 必填 |
| -------------------- | ---------------------------------- | ---------------------------- | ------- | ---- |
| `v-model`            | 对话框的显示状态                   | `boolean`                    | `false` | 是   |
| `title`              | 对话框标题                         | `string`                     | -       | 否   |
| `width`              | 对话框宽度                         | `string`                     | `'50%'` | 否   |
| `zIndex`             | 对话框的 z-index 值                | `number`                     | `1000`  | 否   |
| `appendToBody`       | 是否将对话框挂载到 body 元素上     | `boolean`                    | `true`  | 否   |
| `closeOnClickModal`  | 是否可以通过点击遮罩关闭对话框     | `boolean`                    | `true`  | 否   |
| `closeOnPressEscape` | 是否可以通过按 ESC 键关闭对话框    | `boolean`                    | `true`  | 否   |
| `beforeClose`        | 关闭前的回调函数，接收 `done` 参数 | `(done: () => void) => void` | -       | 否   |

### Events

| 事件名  | 说明             | 回调参数 |
| ------- | ---------------- | -------- |
| `open`  | 对话框打开时触发 | -        |
| `close` | 对话框关闭时触发 | -        |

### Slots

| 插槽名    | 说明                 |
| --------- | -------------------- |
| `default` | 对话框的主要内容     |
| `header`  | 自定义对话框头部内容 |
| `footer`  | 自定义对话框底部内容 |

### Methods

通过 `ref` 可以访问到以下方法：

| 方法名  | 说明       | 参数 |
| ------- | ---------- | ---- |
| `close` | 关闭对话框 | -    |

## 样式定制

对话框的样式可以通过主题色系统进行定制，详见 [自定义主题](/guide/custom-theme/)。

## 注意事项

1. **v-model 绑定**：必须使用 `v-model` 来控制对话框的显示和隐藏
2. **Teleport 挂载**：默认情况下，对话框会通过 `teleport` 挂载到 `body` 元素上，避免样式冲突
3. **关闭逻辑**：如果设置了 `beforeClose`，必须在回调中调用 `done()` 函数才能真正关闭对话框
4. **事件监听**：组件会自动监听 ESC 键，无需手动处理
5. **遮罩点击**：默认情况下点击遮罩会关闭对话框，可以通过 `closeOnClickModal` 属性禁用

## 下一步

- 📖 查看 [快速开始](/guide/quick-start/) 了解如何安装和使用
- 🎨 了解 [自定义主题](/guide/custom-theme/) 来定制对话框样式
- 🧩 查看其他组件的文档
