<script setup lang="ts">
import { GuLuProgress } from '@gulu/ui'
</script>

<template>
  <div class="gulu-progress-demo">
    <div class="demo-item">
      <p>Primary（主要）</p>
      <GuLuProgress :percentage="60" theme="primary" />
    </div>
    <div class="demo-item">
      <p>Success（成功）</p>
      <GuLuProgress :percentage="60" theme="success" />
    </div>
    <div class="demo-item">
      <p>Warning（警告）</p>
      <GuLuProgress :percentage="60" theme="warning" />
    </div>
    <div class="demo-item">
      <p>Danger（危险）</p>
      <GuLuProgress :percentage="60" theme="danger" />
    </div>
    <div class="demo-item">
      <p>Info（信息）</p>
      <GuLuProgress :percentage="60" theme="info" />
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
