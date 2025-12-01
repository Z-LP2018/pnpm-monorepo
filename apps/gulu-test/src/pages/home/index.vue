<template>
  <div class="home">
    <el-button type="primary">home</el-button>
    <div class="my-overflow-1">
      大王大大大王大大大王大大大王大大大王大大大王大大大王大大大王大大大王大大大王大大大王大大大王大大大王大大大王大大大王大大大王大大大王大大大王大大大王大大
    </div>
    <GuLuButton variant="primary">Primary</GuLuButton>
    <GuLuButton variant="secondary">Secondary</GuLuButton>
    <GuLuButton variant="ghost">Ghost</GuLuButton>
  </div>
</template>

<script setup lang="ts">
import { GuLuButton } from '@gulu/ui'
</script>

<style scoped lang="less">
.home {
  height: 100%;
}
</style>
