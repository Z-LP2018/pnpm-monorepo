# Progress 进度条

进度条用于显示任务或操作的完成进度，帮助用户了解当前状态和剩余工作量。

## 基本用法

`GuLuProgress` 组件通过 `percentage` 属性控制进度百分比，默认文字显示在顶部：

:::preview 基本用法

demo-preview=./demos/index.vue

:::

## 文字显示方向

通过 `textDirection` 属性可以控制百分比文字的显示位置，支持 `top`（顶部）和 `right`（右侧）两种方式：

:::preview 文字显示方向

demo-preview=./demos/textDirection.vue

:::

## 主题颜色

组件提供了多种预设主题颜色，通过 `theme` 属性设置：`primary`、`success`、`warning`、`danger`、`info`：

:::preview 主题颜色

demo-preview=./demos/theme.vue

:::

## 自定义颜色

除了使用预设主题，还可以通过 `color` 和 `backgroundColor` 属性自定义进度条的颜色：

:::preview 自定义颜色

demo-preview=./demos/customColor.vue

:::

## 自定义宽度

通过 `width` 属性可以自定义进度条的高度（粗细）：

:::preview 自定义宽度

demo-preview=./demos/customWidth.vue

:::

## API

### Props

| 属性名            | 说明                                                            | 类型                                                                       | 默认值      | 必填 |
| ----------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------- | ---- |
| `percentage`      | 进度百分比（0-100）                                             | `number`                                                                   | `0`         | 否   |
| `textDirection`   | 百分比文字显示方向                                              | `'top' \| 'right'`                                                         | `'top'`     | 否   |
| `theme`           | 进度条主题颜色                                                  | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'`                | `'primary'` | 否   |
| `width`           | 进度条高度（粗细）                                              | `string`                                                                   | `'0.3rem'`  | 否   |
| `color`           | 自定义进度条颜色（RGB 值，格式：`"r,g,b"` 或 `["r,g,b", ...]`） | `\`${number},${number},${number}\` \| \`${number},${number},${number}\`[]` | -           | 否   |
| `backgroundColor` | 自定义背景颜色（RGB 值，格式：`"r,g,b"`）                       | `\`${number},${number},${number}\``                                        | -           | 否   |

### Slots

该组件不提供插槽。

## 样式定制

进度条的颜色可以通过主题色系统进行定制，详见 [自定义主题](/guide/custom-theme/)。

## 注意事项

1. **百分比范围**：`percentage` 属性会自动限制在 0-100 之间，超出范围的值会被自动修正
2. **动画效果**：进度条变化时会有平滑的过渡动画（1秒缓动）
3. **文字跟随**：当 `textDirection` 为 `top` 时，百分比文字会跟随进度条移动
4. **渐变支持**：`color` 属性支持数组格式，可以创建渐变效果
5. **RGB 格式**：自定义颜色需要使用 RGB 格式，例如 `"255,0,0"` 表示红色

## 下一步

- 📖 查看 [快速开始](/guide/quick-start/) 了解如何安装和使用
- 🎨 了解 [自定义主题](/guide/custom-theme/) 来定制进度条颜色
- 🧩 查看其他组件的文档
