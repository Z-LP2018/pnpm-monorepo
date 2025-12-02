<template>
  <div class="gulu-upload">
    <div ref="uploadContainer" class="upload-container">
      <div class="upload-tips">拖拽或点击上传</div>
      <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelect" />
      <slot name="uploadPic">
        <div class="upload-pic cursor-pointer py-2" @click="triggerFileSelect">
          <img :src="defaultIcon" alt="" />
        </div>
      </slot>
      <div
        v-if="uploadFiles!.length > 0"
        @click="showUploadDialog = true"
        class="upload-action cursor-pointer"
      >
        查看文件
      </div>
    </div>
    <UploadDialog v-model="showUploadDialog" :files="uploadFiles || []" @delete="deleteFile" />
  </div>
</template>

<script setup lang="ts">
import defaultIcon from '@/assets/upload/icon.webp'
import { onMounted, onUnmounted, ref } from 'vue'
import type { ResolveFileItem, ResolveFile } from './uploadUtils'
import { resolveItems } from './uploadUtils'
import UploadDialog from './components/UploadDialog.vue'

const showUploadDialog = ref(false)
const props = defineProps<{
  params: Record<string, any>
  url: string
  autoUpload: boolean
  modelValue: ResolveFile[]
}>()

const emits = defineEmits<{
  (name: 'getFiles'): void
  (name: 'uploadSuccess'): void
}>()

//需要上传的文件和上传完成后的返回的url
const uploadFiles = defineModel<ResolveFile[]>('modelValue')
//获取拖拽文件
const uploadContainer = ref<HTMLDivElement | null>(null)
//文件输入框引用
const fileInput = ref<HTMLInputElement | null>(null)

const uploadContainer_dragover = (e: DragEvent) => {
  e.preventDefault() // 必须阻止，否则无法触发 drop
  e.stopPropagation()
}
const uploadContainer_drop = async (e: DragEvent) => {
  e.preventDefault() // 必须阻止，否则无法触发 drop
  e.stopPropagation()
  if (!e.dataTransfer) return
  // 获取拖拽的文件
  const items = e.dataTransfer.items
  // 遍历文件
  if (items) {
    const files = await resolveItems(items)
    handleFiles(files)
  }
}

// 处理文件选择（点击上传）
const handleFileSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  // 将 FileList 转换为 ResolveFileItem[]
  const files: ResolveFileItem[] = Array.from(target.files).map(file => ({
    file,
    name: file.name,
  }))

  handleFiles(files)

  // 清空 input 值，以便可以重复选择同一文件
  target.value = ''
}

// 统一处理文件（拖拽和点击）
const handleFiles = async (files: ResolveFileItem[]) => {
  if (props.autoUpload) {
    uploadFiles.value = files.map(item => ({ item, url: '', percentage: 0 }))
    showUploadDialog.value = true
    await uploadFile(files)
    emits('uploadSuccess')
  } else {
    emits('getFiles')
  }
}

// 触发文件选择
const triggerFileSelect = () => {
  fileInput.value?.click()
}
//上传文件
const uploadFile = async (files: ResolveFileItem[]) => {
  if (!props.url) {
    throw new Error('上传文件地址不能为空')
  } else {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]!
      const formData = new FormData()
      if (props.params) {
        for (const key in props.params) {
          formData.append(key, props.params[key])
        }
      }
      formData.append('file', file.file)

      // 使用 XMLHttpRequest 来支持上传进度
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        // 监听上传进度
        xhr.upload.addEventListener('progress', e => {
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded / e.total) * 100)
            // 更新对应文件的进度
            const fileIndex = uploadFiles.value!.findIndex(
              item => item.item.file === file.file && item.item.name === file.name
            )
            if (fileIndex !== -1) {
              uploadFiles.value![fileIndex]!.percentage = percentage
            }
          }
        })

        // 监听上传完成
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText)
              // 更新对应文件的 URL
              const fileIndex = uploadFiles.value!.findIndex(
                item => item.item.file === file.file && item.item.name === file.name
              )
              if (fileIndex !== -1) {
                uploadFiles.value![fileIndex]!.url = result.data || ''
                uploadFiles.value![fileIndex]!.percentage = 100
              }
              resolve()
            } catch (error) {
              console.error('解析响应失败:', error)
              reject(error)
            }
          } else {
            const error = new Error(`上传失败: ${xhr.status} ${xhr.statusText}`)
            reject(error)
          }
        })

        // 监听上传错误
        xhr.addEventListener('error', () => {
          const error = new Error('网络错误')
          reject(error)
        })

        // 监听上传中断
        xhr.addEventListener('abort', () => {
          const error = new Error('上传已取消')
          reject(error)
        })
        // 发送请求
        xhr.open('POST', props.url)
        xhr.send(formData)
      })
    }
  }
}

const deleteFile = (file: ResolveFile) => {
  if (!uploadFiles.value) return
  const index = uploadFiles.value.findIndex(
    item => item.item.name === file.item.name && item.url === file.url
  )
  if (index !== -1) {
    uploadFiles.value.splice(index, 1)
  }
}
onMounted(() => {
  uploadContainer.value?.addEventListener('dragover', uploadContainer_dragover)
  uploadContainer.value?.addEventListener('drop', uploadContainer_drop)
})
onUnmounted(() => {
  uploadContainer.value?.removeEventListener('dragover', uploadContainer_dragover)
  uploadContainer.value?.removeEventListener('drop', uploadContainer_drop)
})
</script>

<style scoped lang="less">
.gulu-upload {
  .upload-container {
    width: 100%;
    border: 1px solid var(--gulu-primary);
    border-radius: 0.2rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .upload-pic {
      img {
        width: 5rem;
        aspect-ratio: 1/1;
        object-fit: cover;
      }
    }

    .upload-action {
      color: var(--gulu-primary);

      &:hover {
        color: var(--gulu-primary-dark);
      }
    }
  }
}
</style>
