<script setup lang="ts">
import { GuLuButton } from '@gulu/ui'
</script>

<template>
  <div class="gulu-btns">
    <GuLuButton>默认按钮</GuLuButton>
    <GuLuButton variant="primary">主要按钮</GuLuButton>
    <GuLuButton variant="secondary">次要按钮</GuLuButton>
    <GuLuButton variant="ghost">幽灵按钮</GuLuButton>
  </div>
</template>
<style scoped lang="less">
.gulu-btns {
  display: flex;
  gap: 10px;
}
</style>
