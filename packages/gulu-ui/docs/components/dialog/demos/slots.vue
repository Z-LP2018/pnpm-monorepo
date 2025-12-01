<script setup lang="ts">
import { ref } from 'vue'
import { GuLuDialog, GuLuButton } from '@gulu/ui'

const visible = ref(false)
</script>

<template>
  <div>
    <GuLuButton @click="visible = true">打开自定义对话框</GuLuButton>
    <GuLuDialog v-model="visible">
      <template #header>
        <h2 style="margin: 0; color: #409eff">自定义标题</h2>
      </template>

      <div>
        <p>这是对话框的主要内容区域。</p>
        <p>你可以在这里放置任何内容，比如表单、列表等。</p>
      </div>

      <template #footer>
        <GuLuButton variant="secondary" @click="visible = false">取消</GuLuButton>
        <GuLuButton variant="primary" @click="visible = false" style="margin-left: 10px"
          >确定</GuLuButton
        >
      </template>
    </GuLuDialog>
  </div>
</template>
