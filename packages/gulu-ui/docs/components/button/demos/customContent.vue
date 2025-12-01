<script setup lang="ts">
import { GuLuButton } from '@gulu/ui'
</script>

<template>
  <div class="gulu-btns">
    <GuLuButton variant="primary">
      <span style="font-weight: bold">自定义</span>
      <span style="margin-left: 8px">内容</span>
    </GuLuButton>
  </div>
</template>
<style scoped lang="less">
.gulu-btns {
  display: flex;
  gap: 10px;
}
</style>
