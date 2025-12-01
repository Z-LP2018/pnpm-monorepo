<script setup lang="ts">
import { GuLuProgress } from '@gulu/ui'
</script>

<template>
  <div class="gulu-progress-demo">
    <div class="demo-item">
      <p>细进度条（0.2rem）</p>
      <GuLuProgress :percentage="60" width="0.2rem" />
    </div>
    <div class="demo-item">
      <p>默认进度条（0.3rem）</p>
      <GuLuProgress :percentage="60" />
    </div>
    <div class="demo-item">
      <p>粗进度条（0.5rem）</p>
      <GuLuProgress :percentage="60" width="0.5rem" />
    </div>
    <div class="demo-item">
      <p>更粗进度条（0.8rem）</p>
      <GuLuProgress :percentage="60" width="0.8rem" />
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
