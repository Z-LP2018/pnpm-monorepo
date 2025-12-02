<script setup lang="ts">
import { GuLuUpload, type ResolveFile } from '@gulu/ui'
import { ref } from 'vue'

const files = ref<ResolveFile[]>([])
</script>

<template>
  <div>
    <GuLuUpload
      v-model="files"
      url="http://localhost:3000/upload"
      :params="{ userId: '1' }"
      :auto-upload="true"
    >
      <template #uploadPic>
        <div style="text-align: center; padding: 20px">
          <div style="font-size: 48px; margin-bottom: 10px">📁</div>
          <div style="color: #666">点击或拖拽文件到此处上传</div>
        </div>
      </template>
    </GuLuUpload>
  </div>
</template>
