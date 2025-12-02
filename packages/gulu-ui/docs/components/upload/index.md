# Upload 上传

上传组件用于将文件上传到服务器，支持拖拽上传、点击上传、多文件上传、上传进度显示等功能。

## 基本用法

`GuLuUpload` 组件支持拖拽和点击两种上传方式。通过 `v-model` 绑定文件列表，`url` 指定上传接口地址，`auto-upload` 控制是否自动上传：

:::preview 基本用法

demo-preview=./demos/index.vue

:::

## 手动上传

当 `auto-upload` 设置为 `false` 时，组件不会自动上传文件，而是通过 `getFiles` 事件通知父组件，由父组件决定何时上传：

:::preview 手动上传

demo-preview=./demos/manual.vue

:::

## 自定义上传图标

通过 `uploadPic` 插槽可以自定义上传区域的图标：

:::preview 自定义上传图标

demo-preview=./demos/customIcon.vue

:::

## 带参数上传

通过 `params` 属性可以传递额外的参数到上传接口：

:::preview 带参数上传

demo-preview=./demos/withParams.vue

:::

## API

### Props

| 属性名        | 说明                 | 类型                  | 默认值  | 必填 |
| ------------- | -------------------- | --------------------- | ------- | ---- |
| `v-model`     | 文件列表（双向绑定） | `ResolveFile[]`       | `[]`    | 是   |
| `url`         | 上传接口地址         | `string`              | -       | 是   |
| `auto-upload` | 是否自动上传         | `boolean`             | `false` | 否   |
| `params`      | 上传时附加的额外参数 | `Record<string, any>` | `{}`    | 否   |

### Events

| 事件名          | 说明                                   | 回调参数 |
| --------------- | -------------------------------------- | -------- |
| `getFiles`      | 手动上传模式下，选择文件后触发         | -        |
| `uploadSuccess` | 自动上传模式下，所有文件上传成功后触发 | -        |

### Slots

| 插槽名      | 说明                 |
| ----------- | -------------------- |
| `uploadPic` | 自定义上传区域的图标 |

### 类型定义

```typescript
interface ResolveFileItem {
  file: File
  name: string
}

interface ResolveFile {
  item: ResolveFileItem
  url: string
  percentage: number
}
```

## 功能特性

1. **拖拽上传**：支持将文件拖拽到上传区域进行上传
2. **点击上传**：点击上传区域可以打开文件选择对话框
3. **多文件上传**：支持同时选择多个文件进行上传
4. **上传进度**：实时显示每个文件的上传进度
5. **文件管理**：可以查看已上传的文件列表，支持删除文件
6. **目录上传**：支持拖拽整个文件夹，会自动解析文件夹内的所有文件

## 上传接口要求

组件期望后端接口返回以下格式的 JSON 响应：

```json
{
  "data": "https://example.com/uploaded-file.jpg"
}
```

其中 `data` 字段为上传成功后的文件访问 URL。如果接口返回格式不同，需要在上传成功后手动处理响应数据。

## 注意事项

1. **URL 必填**：当 `auto-upload` 为 `true` 时，`url` 属性必须提供，否则会抛出错误
2. **文件列表管理**：通过 `v-model` 绑定的文件列表会在上传过程中自动更新，包括上传进度和返回的 URL
3. **上传进度**：组件使用 `XMLHttpRequest` 来支持上传进度监听，确保浏览器支持该 API
4. **文件删除**：删除文件会从 `v-model` 绑定的列表中移除，但不会向后端发送删除请求
5. **响应格式**：组件期望后端返回 JSON 格式，且包含 `data` 字段作为文件 URL
6. **错误处理**：上传失败时会在控制台输出错误信息，建议在业务代码中添加错误处理逻辑

## 下一步

- 📖 查看 [快速开始](/guide/quick-start/) 了解如何安装和使用
- 🎨 了解 [自定义主题](/guide/custom-theme/) 来定制上传组件样式
- 🧩 查看其他组件的文档
