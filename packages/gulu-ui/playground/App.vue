<script setup lang="ts">
import { ref } from 'vue'
import { GuLuButton, GuLuDialog, GuLuProgress, GuLuUpload } from '../src'
const showDialog = ref(false)
const openDialog = () => {
  showDialog.value = true
}
const uploadFiles = ref<ResolveFile[]>([])
</script>

<template>
  <main class="playground">
    <GuLuButton @click="openDialog">测试</GuLuButton>
    <GuLuUpload
      v-model="uploadFiles"
      autoUpload
      url="http://localhost:3000/upload"
      :params="{ userId: '1' }"
    ></GuLuUpload>
    <GuLuDialog v-model="showDialog" title="测试">
      <GuLuProgress :percentage="50"></GuLuProgress>
    </GuLuDialog>
  </main>
</template>
