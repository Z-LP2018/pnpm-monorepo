<script setup lang="ts">
import { ref } from 'vue'
import { GuLuDialog, GuLuButton } from '@gulu/ui'

const visible1 = ref(false)
const visible2 = ref(false)
</script>

<template>
  <div style="display: flex; gap: 10px">
    <GuLuButton @click="visible1 = true">宽度 30%</GuLuButton>
    <GuLuButton @click="visible2 = true">宽度 500px</GuLuButton>

    <GuLuDialog v-model="visible1" title="较窄的对话框" width="30%">
      <p>这个对话框的宽度设置为 30%。</p>
    </GuLuDialog>

    <GuLuDialog v-model="visible2" title="固定宽度的对话框" width="500px">
      <p>这个对话框的宽度设置为固定的 500px。</p>
    </GuLuDialog>
  </div>
</template>
