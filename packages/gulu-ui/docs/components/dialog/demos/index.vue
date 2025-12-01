<script setup lang="ts">
import { GuLuButton, GuLuDialog } from '@gulu/ui'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <div>
    <GuLuButton @click="visible = true">打开对话框</GuLuButton>
    <GuLuDialog v-model="visible" title="基本对话框">
      <div>这是一个基本的对话框示例。点击遮罩或关闭按钮可以关闭对话框。</div>
    </GuLuDialog>
  </div>
</template>
