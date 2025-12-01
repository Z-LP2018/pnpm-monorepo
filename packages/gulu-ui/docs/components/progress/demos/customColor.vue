<script setup lang="ts">
import { GuLuProgress } from '@gulu/ui'
</script>

<template>
  <div class="gulu-progress-demo">
    <div class="demo-item">
      <p>自定义单色</p>
      <GuLuProgress :percentage="60" color="255,0,150" />
    </div>
    <div class="demo-item">
      <p>自定义渐变</p>
      <GuLuProgress :percentage="60" :color="['255,0,150', '0,150,255']" />
    </div>
    <div class="demo-item">
      <p>自定义背景色</p>
      <GuLuProgress :percentage="60" color="255,100,0" background-color="255,200,150" />
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
