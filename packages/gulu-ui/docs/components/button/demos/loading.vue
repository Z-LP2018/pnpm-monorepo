<script setup lang="ts">
import { GuLuButton } from '@gulu/ui'
import { ref } from 'vue'

const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  try {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('提交成功')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <GuLuButton variant="primary" :loading="isLoading" @click="handleSubmit"> 提交 </GuLuButton>
</template>
