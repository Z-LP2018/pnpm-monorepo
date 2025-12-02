<script setup lang="ts">
import { GuLuUpload, type ResolveFile } from '@gulu/ui'
import { ref } from 'vue'

const files = ref<ResolveFile[]>([])

const uploadParams = {
  userId: '1',
  category: 'avatar',
  timestamp: Date.now(),
}
</script>

<template>
  <div>
    <GuLuUpload
      v-model="files"
      url="http://localhost:3000/upload"
      :auto-upload="true"
      :params="uploadParams"
    />
    <div style="margin-top: 10px; font-size: 12px; color: #666">
      上传时会附带参数：userId, category, timestamp
    </div>
  </div>
</template>
