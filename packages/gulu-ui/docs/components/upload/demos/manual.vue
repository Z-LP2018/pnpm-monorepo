<script setup lang="ts">
import { GuLuUpload, GuLuButton, type ResolveFile } from '@gulu/ui'
import { ref } from 'vue'

const files = ref<ResolveFile[]>([])

const handleGetFiles = () => {
  console.log('获取到文件列表', files.value)
  // 在这里可以手动处理文件上传逻辑
  alert(`已选择 ${files.value.length} 个文件，可以手动上传`)
}
</script>

<template>
  <div>
    <GuLuUpload
      v-model="files"
      url="http://localhost:3000/upload"
      :params="{ userId: '1' }"
      :auto-upload="false"
      @get-files="handleGetFiles"
    />
    <div style="margin-top: 10px">
      <GuLuButton v-if="files.length > 0" @click="handleGetFiles">
        手动上传 ({{ files.length }} 个文件)
      </GuLuButton>
    </div>
  </div>
</template>
