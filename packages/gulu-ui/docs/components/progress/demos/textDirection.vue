<script setup lang="ts">
import { GuLuProgress } from '@gulu/ui'
</script>

<template>
  <div class="gulu-progress-demo">
    <div class="demo-item">
      <p>顶部显示（默认）</p>
      <GuLuProgress :percentage="60" text-direction="top" />
    </div>
    <div class="demo-item">
      <p>右侧显示</p>
      <GuLuProgress :percentage="60" text-direction="right" />
    </div>
  </div>
</template>

<style scoped lang="less">
.gulu-progress-demo {
  width: 100%;
  padding: 20px 0;

  .demo-item {
    margin-bottom: 30px;

    p {
      margin-bottom: 10px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
