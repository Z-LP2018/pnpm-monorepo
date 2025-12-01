<template>
  <div class="gulu-upload">
    <div ref="uploadContainer" class="upload-container">
      <div class="upload-tips">拖拽或点击上传</div>
      <slot name="uploadPic">
        <div class="upload-pic cursor-pointer">
          <img :src="defaultIcon" alt="" />
        </div>
      </slot>
      <div class="upload-action">
        {{ autoUpload }}
        {{ actionUrl }}
        {{ waitUploadFiles }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultIcon from '@/assets/upload/icon.webp'
import { onMounted, onUnmounted, ref } from 'vue'
import type { ResolveFileItem } from './uploadUtils'
import { resolveItems } from './uploadUtils'

const { autoUpload = true, actionUrl = '127.0.0.1' } = defineProps<{
  //是否自动上传
  autoUpload?: boolean
  //上传到的url
  actionUrl?: string
}>()
//获取到的所有文件
const waitUploadFiles = ref<ResolveFileItem[]>([])
//获取拖拽文件
const uploadContainer = ref<HTMLDivElement | null>(null)

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
    waitUploadFiles.value = files
  }
}
onMounted(() => {
  uploadContainer.value!.addEventListener('dragover', uploadContainer_dragover)
  uploadContainer.value!.addEventListener('drop', uploadContainer_drop)
})
onUnmounted(() => {
  uploadContainer.value!.removeEventListener('dragover', uploadContainer_dragover)
  uploadContainer.value!.removeEventListener('drop', uploadContainer_drop)
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

    .upload-tips {
      color: var(--gulu-primary);
    }

    .upload-pic {
      img {
        width: 5rem;
        aspect-ratio: 1/1;
        object-fit: cover;
      }
    }
  }
}
</style>
