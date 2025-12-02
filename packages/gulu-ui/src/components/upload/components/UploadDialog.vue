<template>
  <GuLuDialog v-model="modelValue" title="上传文件">
    <template #default>
      <div v-for="file in files" class="upload-file-item" :key="file.item.name">
        <div class="flex items-center justify-between mb-2">
          <div class="upload-file-name">{{ file.item.name }}</div>
          <GuLuProgress class="w-[50%]" :percentage="file.percentage" />
        </div>
        <div class="flex items-center justify-between">
          <div
            v-if="file.url"
            @click="openUrl(file.url)"
            class="upload-tips cursor-pointer flex-1 truncate"
            :title="file.url"
          >
            {{ file.url }}
          </div>
          <div v-else class="text-gray-400 text-sm">上传中...</div>
          <div
            v-if="file.url"
            @click.stop="handleDelete(file)"
            class="delete-icon cursor-pointer ml-2"
            title="删除文件"
          >
            ×
          </div>
        </div>
      </div>
    </template>
  </GuLuDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ResolveFile } from '../uploadUtils'
import GuLuDialog from '../../dialog/GuLuDialog.vue'
import GuLuProgress from '../../progress/GuLuProgress.vue'

const props = defineProps<{
  modelValue: boolean
  files: ResolveFile[]
}>()

const emits = defineEmits<{
  (name: 'update:modelValue', value: boolean): void
  (name: 'delete', value: ResolveFile): void
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})

const openUrl = (url: string) => {
  if (!url) {
    console.warn('URL 为空，无法打开')
    return
  }
  window.open(url, '_blank')
}

const handleDelete = (file: ResolveFile) => {
  emits('delete', file)
}
</script>

<style scoped lang="less">
.upload-file-item {
  padding: 0.5rem 0;
  margin: 0.5rem 0;
  border-bottom: 1px solid #9ca3af;

  &:last-child {
    border-bottom: none;
  }
}

.upload-file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.upload-tips {
  color: var(--gulu-primary);
}

.delete-icon {
  color: #ef4444;
  font-size: 1.5rem;
  line-height: 1;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background-color: #fee2e2;
    color: #dc2626;
  }

  &:active {
    transform: scale(0.9);
  }
}
</style>
