<script setup lang="ts">
import { ref } from 'vue'
import { GuLuDialog, GuLuButton } from '@gulu/ui'

const visible1 = ref(false)
const visible2 = ref(false)
const visible3 = ref(false)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 10px">
    <div>
      <GuLuButton @click="visible1 = true">禁用点击遮罩关闭</GuLuButton>
      <GuLuDialog v-model="visible1" title="禁用点击遮罩关闭" :close-on-click-modal="false">
        <p>这个对话框不能通过点击遮罩关闭，只能通过关闭按钮或 ESC 键关闭。</p>
      </GuLuDialog>
    </div>

    <div>
      <GuLuButton @click="visible2 = true">禁用 ESC 键关闭</GuLuButton>
      <GuLuDialog v-model="visible2" title="禁用 ESC 键关闭" :close-on-press-escape="false">
        <p>这个对话框不能通过按 ESC 键关闭，只能通过关闭按钮或点击遮罩关闭。</p>
      </GuLuDialog>
    </div>

    <div>
      <GuLuButton @click="visible3 = true">只能通过按钮关闭</GuLuButton>
      <GuLuDialog
        v-model="visible3"
        title="只能通过按钮关闭"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <p>这个对话框只能通过右上角的关闭按钮关闭。</p>
      </GuLuDialog>
    </div>
  </div>
</template>
