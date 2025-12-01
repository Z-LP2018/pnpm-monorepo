<script setup lang="ts">
import { ref } from 'vue'
import { GuLuButton, GuLuDialog, GuLuProgress, GuLuUpload } from '../src'
const showDialog = ref(false)
const openDialog = () => {
  showDialog.value = true
}
</script>

<template>
  <main class="playground">
    <GuLuButton @click="openDialog">测试</GuLuButton>
    <GuLuDialog v-model="showDialog" title="测试">
      <GuLuUpload></GuLuUpload>
      <GuLuProgress :percentage="50"></GuLuProgress>
    </GuLuDialog>
  </main>
</template>
