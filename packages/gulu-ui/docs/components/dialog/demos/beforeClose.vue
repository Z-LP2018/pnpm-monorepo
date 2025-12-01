<script setup lang="ts">
import { ref } from 'vue'
import { GuLuDialog, GuLuButton } from '@gulu/ui'

const visible = ref(false)

const handleBeforeClose = (done: () => void) => {
  if (confirm('确定要关闭对话框吗？')) {
    done()
  }
}
</script>

<template>
  <div>
    <GuLuButton @click="visible = true">打开对话框（关闭前确认）</GuLuButton>
    <GuLuDialog v-model="visible" title="关闭前确认" :before-close="handleBeforeClose">
      <p>尝试关闭这个对话框，会弹出确认提示。</p>
      <p>只有点击确认后才会真正关闭。</p>
    </GuLuDialog>
  </div>
</template>
